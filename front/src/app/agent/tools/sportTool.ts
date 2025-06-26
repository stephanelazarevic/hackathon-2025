import { z } from 'zod';
import axios from 'axios';
import { tool } from '@langchain/core/tools';

interface SportRecord {
  nom_usuel?: string;
  discipline_pratique?: string;
  commune?: string;
}

interface SportAPIResponse {
  records: {
    fields: SportRecord;
  }[];
}

export const sportEquipmentTool = tool(
  async ({ commune }) => {
    console.log('[🟢 SPORT TOOL] Appelé avec :', commune);
    const response = await axios.get<SportAPIResponse>(
      'https://equipements.sports.gouv.fr/api/records/1.0/search/',
      {
        params: {
          dataset: 'data-es',
          rows: 5,
          q: commune,
        },
      }
    );

    const results = response.data.records.map((rec) => {
      const f = rec.fields;
      return `${f.nom_usuel || 'Nom inconnu'} - ${f.discipline_pratique || 'Discipline inconnue'} à ${f.commune || 'Commune inconnue'}`;
    });

    return results.join('\n') || 'Aucun équipement trouvé.';
  },
  {
    name: 'find_sport_equipments',
    description: 'Recherche des équipements sportifs dans une commune donnée.',
    schema: z.object({
      commune: z.string().describe("Nom de la commune (ex: Paris, Lyon, Marseille)"),
    })
  });
