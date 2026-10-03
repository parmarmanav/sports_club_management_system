import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Sports Club Management API',
    description: 'API documentation for the Sports Club Management System backend',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token in the format: Bearer <token>'
    }
  },
  security: [ { bearerAuth: [] } ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

// Generate the swagger-output.json
swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger JSON generated successfully!");
});
