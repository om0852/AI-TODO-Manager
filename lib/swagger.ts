// lib/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'AI-powered Task Manager using Next.js backend',
    },
  },
  apis: ['./app/api/**/*.ts'], // ✅ Point to your API route handlers
});
