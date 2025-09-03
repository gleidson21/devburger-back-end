/* eslint-disable prettier/prettier */
// src/app/models/mongo/Order.js

import mongoose from 'mongoose'; // Importa o Mongoose

const OrderSchema = new mongoose.Schema(
  {
    // ID do usuário que fez o pedido (referência ao ID do usuário no PostgreSQL)
    user: {
      type: String, // Tipo para IDs de MongoDB (pode ser String se você não vai referenciar diretamente)
      required: true,
      // Se você quiser referenciar o ID do usuário do PostgreSQL, o tipo seria String
      // pois IDs de SQL não são ObjectId do MongoDB.
      // type: String,
      // required: true,
    },
    
    // Produtos no pedido
    products: [
      {
        product_id: {
          type: Number, // ID do produto do PostgreSQL
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        //category: {
        // type: Number,
        //required: true,
        // },
        url: {
          // URL da imagem do produto no momento do pedido
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
    // Status do pedido (ex: "Pendente", "Em Preparação", "Entregue", "Cancelado")
    status: {
      type: String,
      enum: ['Pendente', 'Em Preparação', 'Entregue', 'Cancelado'], // Define os valores permitidos
      default: 'Pendente',
      required: true,
    },
    // Endereço de entrega (opcional, ou você pode ter um schema de endereço separado)
    address: {
      street: String,
      number: String,
      complement: String,
      city: String,
      state: String,
      zipCode: String,
    },
    // Valor total do pedido (calculado no backend)
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    // timestamps: true adiciona automaticamente `createdAt` e `updatedAt`
    // MongoDB usa camelCase por padrão para esses campos
    timestamps: true,
  },
);

// Exporta o modelo 'Order', que representa a coleção 'orders' no MongoDB
export default mongoose.model('Order', OrderSchema);
