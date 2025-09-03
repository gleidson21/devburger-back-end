/* eslint-disable prettier/prettier */
// src/app/models/product.js

import { DataTypes, Model, Sequelize } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init({
      id: { // Para o teste, vamos usar INTEGER (número sequencial) para simplificar
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-incremento para não precisar gerar IDs
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // >>>>> REMOVA ESTE BLOCO 'category' <<<<<
      // category: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // >>>>> FIM DO BLOCO A SER REMOVIDO <<<<<

      // O category_id já foi adicionado via migração e será usado para a associação
      // category_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true, // Ou false, dependendo se um produto SEMPRE deve ter uma categoria
      // },

      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      offer:{
        type: Sequelize.BOOLEAN,
      },
      url: {
        type: DataTypes.VIRTUAL,
        get(){
          return `http://localhost:3000/products-file/${this.path}`;
        }
      }
    }, {
      sequelize,
      timestamps: true, // Adiciona automaticamente os campos `created_at` e `updated_at`
      createdAt: 'created_at', // Mapeia `createdAt` do Sequelize para `created_at` no DB
      updatedAt: 'updated_at',
    });
  }

  static associate(models) {
    // Um produto pertence a UMA categoria
    // 'belongsTo' define a chave estrangeira (category_id) nesta tabela (products)
    // 'foreignKey: 'category_id'' especifica a coluna que é a chave estrangeira
    // 'as: 'category'' define o alias que será usado ao incluir a categoria (ex: product.category)
    this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  }
}

export default Product;
