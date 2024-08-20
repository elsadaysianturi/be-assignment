// src/routes/auth.js
const supabase = require('../supabase');

async function authRoutes(fastify, options) {
  fastify.post('/register', {
    schema: {
      description: 'Register a new user',
      tags: ['Auth'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            status: { type: 'string' },
            user: { type: 'object' },
          },
        },
        400: {
          description: 'User registration failed',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      console.log('Attempting to register user:', { email, password });

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('Supabase signUp error:', error);
        return reply.status(400).send({ error: error.message });
      }

      console.log('User registered successfully:', data.user);

      reply.send({ status: 'User registered', user: data.user });
    } catch (error) {
      console.error('User registration failed with error:', error);
      reply.status(500).send({ error: 'User registration failed' });
    }
  });


  fastify.post('/login', {
    schema: {
      description: 'Log in an existing user',
      tags: ['Auth'],
      summary: 'Log in an existing user',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        401: {
          description: 'Invalid email or password',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      console.log('Attempting to log in user:', { email });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Supabase signIn error:', error);
        return reply.status(401).send({ error: error.message });
      }

      console.log('User logged in successfully:', data.session);

      reply.send({ token: data.session.access_token });
    } catch (error) {
      console.error('Login failed with error:', error);
      reply.status(500).send({ error: 'Login failed' });
    }
  });

  // Example route
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
}

module.exports = authRoutes;
