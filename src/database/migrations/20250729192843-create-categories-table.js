// src/database/migrations/xxxxxxx-create-categories-table.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, { DataTypes, Sequelize }) {
    await queryInterface.createTable('categories', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que não haja categorias com nomes duplicados
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        // Sequelize gerenciará isso se timestamps: true estiver no modelo
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        // Sequelize gerenciará isso se timestamps: true estiver no modelo
      },
    });
  },

  async down(queryInterface, { Sequelize }) {
    await queryInterface.dropTable('categories');
  },
};
