/* eslint-disable prettier/prettier */
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
    this.pgConnection = new Sequelize(configDatabase.url, configDatabase);

    // Inicializa cada modelo Sequelize com a instância da conexão PostgreSQL
    models.forEach((model) => model.init(this.pgConnection));
  }

  // Método para inicializar a conexão MongoDB (Mongoose)
  initMongoDB() {
  mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

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
