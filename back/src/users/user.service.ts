import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { Project } from 'src/project/project.schema';
import { CreateProjectDto } from 'src/project/create-project.dto';
import { CreateMessageDto } from 'src/message/create-message.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save(); // Le middleware pre-save va automatiquement hacher le mot de passe
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ isActive: true })
      .select(['-password', '-projects', '-__v']) // Exclure le mot de passe, les projets et la version des résultats
      .exec(); // Exclure le mot de passe et les projets des résultats
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec(); // Inclure le mot de passe pour l'authentification
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).select('-password').exec();
  }

  /**
   * Ajoute un nouveau projet à un utilisateur
   * @param userId - ID de l'utilisateur
   * @param projectName - Nom du projet à créer
   * @returns L'utilisateur mis à jour avec le nouveau projet
   */
  async addProject(userId: string, project: CreateProjectDto): Promise<User> {
    // Vérification que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Vérification que le nom du projet n'est pas vide
    if (!project || !project.name || project.name.trim().length === 0) {
      throw new BadRequestException('Le nom du projet ne peut pas être vide');
    }

    // Vérification que le projet n'existe pas déjà pour cet utilisateur
    const existingProject = user.projects.find(
      (proj) => proj.name.toLowerCase() === project.name.toLowerCase(),
    );
    if (existingProject) {
      throw new BadRequestException(
        `Un projet nommé "${project.name}" existe déjà pour cet utilisateur`,
      );
    }

    // Création du nouveau projet
    const newProject = {
      _id: new Types.ObjectId(),
      name: project.name.trim(),
      messages: [],
    };

    // Ajout du projet à l'utilisateur et sauvegarde
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { projects: newProject } },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(
        `Erreur lors de l'ajout du projet à l'utilisateur avec l'ID ${userId}`,
      );
    }

    return updatedUser;
  }

  /**
   * Ajoute un message à un projet spécifique d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @param projectId - ID du projet
   * @param content - Contenu du message
   * @param sender - Expéditeur du message
   * @returns L'utilisateur mis à jour
   */
  async addMessageToProject(
    userId: string,
    projectId: string,
    message: CreateMessageDto,
  ): Promise<User> {
    // Vérification que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Vérification que le contenu du message n'est pas vide
    if (!message || !message.content || message.content.trim().length === 0) {
      throw new BadRequestException(
        'Le contenu du message ne peut pas être vide',
      );
    }

    // Recherche du projet dans l'utilisateur
    const projectIndex = user.projects.findIndex(
      (project) => project._id.toString() === projectId,
    );

    if (projectIndex === -1) {
      throw new NotFoundException(
        `Projet avec l'ID ${projectId} non trouvé pour cet utilisateur`,
      );
    }

    // Création du nouveau message
    const newMessage = {
      _id: new Types.ObjectId(),
      content: message.content.trim(),
      sender: message.sender,
      timestamp: new Date(),
    };

    // Mise à jour du projet avec le nouveau message
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        'projects._id': projectId,
      },
      {
        $push: { 'projects.$.messages': newMessage },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('Erreur lors de la mise à jour du projet');
    }

    return updatedUser;
  }

  /**
   * Méthode utilitaire pour récupérer un projet spécifique d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @param projectId - ID du projet
   * @returns Le projet trouvé
   */
  async getProjectById(userId: string, projectId: string): Promise<Project> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const project = user.projects.find(
      (project) => project._id.toString() === projectId,
    );

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${projectId} non trouvé`);
    }

    return project;
  }

  // Méthode pour valider les identifiants de connexion
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
