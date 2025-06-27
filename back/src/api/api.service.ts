import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Api, ApiDocument } from './api.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApiService {
  private readonly docsPath = path.join(process.cwd(), 'src/api/docs'); // Répertoire contenant les fichiers de doc
  private readonly logger = new Logger(ApiService.name);

  constructor(@InjectModel(Api.name) private apiModel: Model<ApiDocument>) {}

  async findAll(): Promise<Api[]> {
    const apis = await this.apiModel.find().exec();

    // Charger le contenu des fichiers de documentation
    return apis.map((api) => {
      const apiObj = api.toObject();

      if (apiObj.doc && typeof apiObj.doc === 'string') {
        try {
          const docContent = this.loadDocFile(apiObj.doc);
          apiObj.doc = docContent;
        } catch (error) {
          this.logger.error(
            `Erreur lors du chargement du fichier de doc ${apiObj.doc}:`,
            error.message,
          );
        }
      }

      return apiObj;
    });
  }

  private loadDocFile(filename: string): any {
    const filePath = path.join(this.docsPath, filename);

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Le fichier ${filename} n'existe pas dans ${this.docsPath}`,
      );
    }

    // Lire et parser le fichier JSON
    const fileContent = fs.readFileSync(filePath, 'utf8');

    try {
      return JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error(
        `Erreur lors du parsing JSON du fichier ${filename}: ${parseError.message}`,
      );
    }
  }
}
