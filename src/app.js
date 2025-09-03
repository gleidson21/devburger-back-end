// app.js

import express from 'express';
import routes from './routes.js';
import './database/index.js';
import cors from 'cors';
import { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe'; // ⚠️ Importe a biblioteca do Stripe

// ⚠️ Carregue as variáveis de ambiente
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

class App {
  constructor() {
    this.app = express();
    // ⚠️ Inicialize o Stripe com sua chave secreta
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.app.use(cors());
    this.middlewares();
    this.routes();
    // ⚠️ Adicione a rota de pagamento aqui
    this.setupStripePaymentRoute();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use('/files', express.static(resolve(__dirname, '..', 'uploads')));
    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );
  }

  routes() {
    this.app.use(routes);
  }

  // ⚠️ Novo método para configurar a rota de pagamento do Stripe
  setupStripePaymentRoute() {
    this.app.post('/create-payment-intent', async (req, res) => {
      const { total } = req.body;

      if (!total || typeof total !== 'number' || total <= 0) {
        return res.status(400).json({ error: 'O valor total é inválido.' });
      }

      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(total * 100),
          currency: 'brl',
          automatic_payment_methods: {
            enabled: true,
          },
        });

        res.status(200).json({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error('Erro ao criar PaymentIntent:', error.message);
        res.status(500).json({ error: error.message });
      }
    });
  }
}

export default new App().app;
