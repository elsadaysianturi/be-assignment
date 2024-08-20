const { PrismaClient, TransactionStatus, TransactionType } = require('@prisma/client');
const prisma = new PrismaClient();

async function transactionRoutes(fastify, options) {

  fastify.post('/send', {
    schema: {
      description: 'Send a transaction',
      tags: ['Transaction'],
      summary: 'Send a transaction',
      body: {
        type: 'object',
        required: ['accountId', 'amount', 'receiver_account'],
        properties: {
          accountId: { type: 'string' },
          amount: { type: 'number' },
          receiver_account: { type: 'string' }, 
        },
      },
      response: {
        200: {
          description: 'Transaction successful',
          type: 'object',
          properties: {
            status: { type: 'string' },
            transaction: { type: 'object' },
          },
        },
        400: {
          description: 'Bad Request',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        404: {
          description: 'Account not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { accountId, amount, receiver_account } = request.body;

    try {
      console.log('Received send transaction request:', { accountId, amount, receiver_account });

      if (!request.user) {
        console.warn('Unauthorized access attempt');
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const account = await prisma.account.findUnique({ where: { id: accountId } });

      if (!account) {
        console.warn('Account not found:', { accountId });
        return reply.status(404).send({ error: 'Account not found' });
      }

      if (account.balance < amount) {
        console.warn('Insufficient balance:', { accountId, balance: account.balance, amount });
        return reply.status(400).send({ error: 'Insufficient balance' });
      }

      const transaction = await prisma.transaction.create({
        data: {
          type: TransactionType.send,
          amount,
          receiver_account, 
          accountId: account.id,
          status: TransactionStatus.pending,
        },
      });

      console.debug('Transaction created:', transaction);

      processTransaction(transaction).then(async (completedTransaction) => {
        await prisma.transaction.update({
          where: { id: completedTransaction.id },
          data: { status: TransactionStatus.success, completed_time: new Date() },
        });

        await prisma.account.update({
          where: { id: account.id },
          data: { balance: account.balance - amount },
        });

        console.log('Transaction completed successfully:', completedTransaction);
        reply.send({ status: 'Transaction successful', transaction: completedTransaction });
      });

    } catch (error) {
      console.error('Transaction processing failed:', error);
      reply.status(500).send({ error: 'Transaction failed' });
    }
  });

  fastify.post('/withdraw', {
    schema: {
      description: 'Withdraw from account',
      tags: ['Transaction'],
      summary: 'Withdraw funds',
      body: {
        type: 'object',
        required: ['accountId', 'amount'],
        properties: {
          accountId: { type: 'string' },
          amount: { type: 'number' },
        },
      },
      response: {
        200: {
          description: 'Transaction successful',
          type: 'object',
          properties: {
            status: { type: 'string' },
            transaction: { type: 'object' },
          },
        },
        400: {
          description: 'Bad Request',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        404: {
          description: 'Account not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { accountId, amount } = request.body;

    try {
      console.log('Received withdraw transaction request:', { accountId, amount });

      if (!request.user) {
        console.warn('Unauthorized access attempt');
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const account = await prisma.account.findUnique({ where: { id: accountId } });

      if (!account) {
        console.warn('Account not found:', { accountId });
        return reply.status(404).send({ error: 'Account not found' });
      }

      if (account.balance < amount) {
        console.warn('Insufficient balance:', { accountId, balance: account.balance, amount });
        return reply.status(400).send({ error: 'Insufficient balance' });
      }

      const transaction = await prisma.transaction.create({
        data: {
          type: TransactionType.withdraw,
          amount,
          receiver_account: '', 
          accountId: account.id,
          status: TransactionStatus.pending,
        },
      });

      console.debug('Transaction created:', transaction);

      processTransaction(transaction).then(async (completedTransaction) => {
        await prisma.transaction.update({
          where: { id: completedTransaction.id },
          data: { status: TransactionStatus.success, completed_time: new Date() },
        });

        await prisma.account.update({
          where: { id: account.id },
          data: { balance: account.balance - amount },
        });

        console.log('Transaction completed successfully:', completedTransaction);
        reply.send({ status: 'Transaction successful', transaction: completedTransaction });
      });

    } catch (error) {
      console.error('Transaction processing failed:', error);
      reply.status(500).send({ error: 'Transaction failed' });
    }
  });
}

function processTransaction(transaction) {
  return new Promise((resolve) => {
    console.log('Transaction processing started for:', transaction);

    setTimeout(() => {
      console.log('Transaction processed for:', transaction);
      resolve(transaction);
    }, 30000); 
  });
}

module.exports = transactionRoutes;
