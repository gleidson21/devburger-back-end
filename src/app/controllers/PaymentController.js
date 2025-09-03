/* eslint-disable prettier/prettier */
// src/controllers/PaymentController.js

import Stripe from 'stripe';
import dotenv from 'dotenv';
import * as Yup from 'yup';

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define o esquema de validação para a requisição
const schema = Yup.object().shape({
    // A chave 'products' deve ser um array
    products: Yup.array()
        .required('O carrinho não pode estar vazio.')
        .of(
            Yup.object().shape({
                // Ajusta para o formato que o frontend envia
                id: Yup.number().required('ID do produto é obrigatório.'),
                // Corrige o erro de digitação de 'quntity' para 'quantity'
                quantity: Yup.number().required('A quantidade é obrigatória.').min(1, 'A quantidade mínima é 1.'),
                price: Yup.number().required('O preço é obrigatório.'),
            }),
        )
});

class PaymentController {
    async createPaymentIntent(req, res) {
        try {
            console.log('Dados recebidos da requisição:', req.body);
            
            // Validação com Yup
            await schema.validate(req.body, { abortEarly: false });
            
            const { products } = req.body;

            // Calcula o valor total de forma segura no backend
            const totalAmount = products.reduce((total, product) => {
                return total + product.quantity * product.price;
            }, 0);

            // O Stripe trabalha com valores em centavos, então multiplicamos por 100
            const amountInCents = Math.round(totalAmount * 100);

            console.log('Valor total calculado (em centavos):', amountInCents);
            
            // Cria a intenção de pagamento no Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'brl',
            });
            
            console.log('PaymentIntent criado com sucesso:', paymentIntent.id);

            return res.status(200).json({
                success: true,
                clientSecret: paymentIntent.client_secret,
            });

        } catch (error) {
            console.error('------------------------------------------');
            console.error('Erro DETALHADO na criação do PaymentIntent:');
            console.error(error); // Isso irá imprimir o objeto de erro completo
            console.error('------------------------------------------');
            
            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({
                    success: false,
                    message: "Erro de validação nos dados enviados.",
                    errors: error.errors
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Falha ao processar o pagamento. Tente novamente mais tarde.',
                error: error.message
            });
        }
    }
}

export default new PaymentController();