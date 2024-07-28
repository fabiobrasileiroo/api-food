import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Restaurantes e Alimentos',
      version: '1.0.0',
      description: 'Documentação da API para gerenciar restaurantes e alimentos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [join(__dirname, 'server.js')], // Caminho para o arquivo de configuração do servidor
};

const swaggerSpec = swaggerJsdoc(options);

export default {
  swaggerUi,
  swaggerSpec,
};
