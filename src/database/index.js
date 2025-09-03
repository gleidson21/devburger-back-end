/**esse eo quinto que configuro */

import Sequelize from 'sequelize';
import mongoose from 'mongoose'; // <<< Importação CORRETA do Mongoose

import User from '../app/models/Users.js';
import configDatabase from '../config/database.js';
import Product from '../app/models/product.js'; // Ajustado para 'Product' com P maiúsculo
import Category from '../app/models/Category.js';

// Array de todos os modelos do Sequelize que você tem
const models = [User, Product, Category];

class Database {
  constructor() {
    this.initPostgreSQL(); // Inicializa a conexão PostgreSQL (Sequelize)
    this.associateModels(); // Configura as associações dos modelos Sequelize
    this.initMongoDB(); // Inicializa a conexão MongoDB (Mongoose)
  }

  // Método para inicializar a conexão PostgreSQL (Sequelize)
  initPostgreSQL() {
    this.pgConnection = new Sequelize(configDatabase); // Renomeado para 'pgConnection' para evitar conflitos

    // Inicializa cada modelo Sequelize com a instância da conexão PostgreSQL
    models.forEach((model) => model.init(this.pgConnection));
  }

  // Método para inicializar a conexão MongoDB (Mongoose)
  initMongoDB() {
    // Conexão CORRETA com o Mongoose
    mongoose
      .connect('mongodb://localhost:27017/devburger', {
        // Essas opções são boas práticas, mas podem ser opcionais dependendo da versão do Mongoose/Node
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => console.log('MongoDB conectado com sucesso!'))
      .catch((error) => console.error('Erro ao conectar MongoDB:', error));
  }

  // Método para configurar as associações Sequelize
  associateModels() {
    models.forEach((model) => {
      // Verifica se o modelo tem um método 'associate' definido
      if (model.associate) {
        // Chama o método 'associate' do modelo, passando todos os modelos conectados do Sequelize
        model.associate(this.pgConnection.models);
      }
    });
  }
}

export default new Database();
