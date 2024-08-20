// src/index.js
const fastify = require('fastify')({ logger: true });
const swaggerUi = require('@fastify/swagger-ui');
const authRoutes = require('./routes/auth');
const supabase = require('./supabase'); 

// Register Swagger plugin
fastify.register(require('@fastify/swagger'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'User Service API Documentation',
      description: 'API documentation for Fastify server',
      version: '0.1.0'
    },
    host: 'localhost:3001',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});


fastify.register(swaggerUi, {
  routePrefix: '/docs',
  swaggerOptions: {
    url: '/documentation/swagger.json',
  },
});


fastify.register(authRoutes, { prefix: '/auth' });

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: 'localhost' });
    fastify.swagger();  
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
