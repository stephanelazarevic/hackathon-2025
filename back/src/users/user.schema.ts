import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './update-user.dto';
import { Project } from 'src/project/project.schema';

export type UserDocument = User & Document;

@Schema({ _id: true, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Project], default: [] })
  projects: Project[];
}

export const UserSchema = SchemaFactory.createForClass(User);

const saltRounds = 10;

// Middleware pre-save pour hacher le mot de passe
UserSchema.pre<UserDocument>('save', async function (next) {
  // Si le mot de passe n'est pas modifié, passer au suivant
  if (!this.isModified('password')) {
    return next();
  }

  // Si le mot de passe est vide (authentification par Google) ou déjà haché, ne pas le hacher
  if (this.password && this.password.length > 0) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Middleware pre-findOneAndUpdate pour hacher le mot de passe lors des mises à jour
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateUserDto;

  if (update.password) {
    update.password = await bcrypt.hash(update.password, saltRounds);
  }

  next();
});
