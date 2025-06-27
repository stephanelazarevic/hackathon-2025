import { z } from 'zod';
import axios from 'axios';
import { tool } from '@langchain/core/tools';

interface CultureRecord {
  nom?: string;
  commune?: string;
  departement?: string;
}

interface CultureAPIResponse {
  records: {
    fields: CultureRecord;
  }[];
}

export const culturalEquipmentTool = tool(
  async ({ commune }) => {
    console.log('[🟣 CULTURE TOOL] Appelé avec :', commune); 
    const response = await axios.get<CultureAPIResponse>(
      'https://data.culture.gouv.fr/api/records/1.0/search/',
      {
        params: {
          dataset: 'base-des-lieux-et-des-equipements-culturels',
          rows: 5,
          refine: {
            commune: commune,
            departement: commune,
          },
        },
      }
    );

    const results = response.data.records.map((rec) => {
      const f = rec.fields;
      return `${f.nom || 'Lieu inconnu'} - ${f.commune || 'Commune inconnue'} (${f.departement || 'Département inconnu'})`;
    });

    return results.join('\n') || 'Aucun équipement culturel trouvé.';
  },
  {
    name: 'find_cultural_sites_equipements',
    description: 'Recherche les équipements culturels à partir d’une commune ou d’un département (ex: Paris, 75, Lyon).',
    schema: z.object({
      commune: z.string().describe("Commune ou département (ex: Paris, 75, Lyon)"),
    })
  }
);


