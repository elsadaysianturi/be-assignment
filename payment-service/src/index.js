const fastify = require('fastify')({ logger: true });
const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');
const transRoutes = require('./routes/transactions');
fastify.register(require('@fastify/cors'), {
  origin: '*', 
});
// Register Swagger
fastify.register(require('@fastify/swagger'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Payment Service API Documentation',
      description: 'API documentation for the Payment Service',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});

fastify.register(swaggerUi, {
  routePrefix: '/docs',
  swaggerOptions: {
    url: '/documentation/swagger.json',
  },
});

fastify.register(transRoutes, { prefix: '/transaction' });


// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: 'localhost' });
    fastify.swagger();  // Initialize the Swagger documentation
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
