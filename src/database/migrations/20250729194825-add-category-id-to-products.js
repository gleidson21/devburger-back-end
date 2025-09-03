// src/database/migrations/xxxxxxx-add-category-id-to-products.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, { DataTypes, Sequelize }) {
    // Adiciona a coluna 'category_id' à tabela 'products'
    await queryInterface.addColumn('products', 'category_id', {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode ser null no início, ou false se for obrigatório
      references: { model: 'categories', key: 'id' }, // Chave estrangeira para a tabela categories
      onUpdate: 'CASCADE', // Se a categoria for atualizada, atualiza aqui
      onDelete: 'SET NULL', // Se a categoria for deletada, define como NULL (ou 'CASCADE' para deletar o produto)
    });
  },

  async down(queryInterface, { Sequelize }) {
    // Remove a coluna 'category_id' se a migração for revertida
    await queryInterface.removeColumn('products', 'category_id');
  },
};
