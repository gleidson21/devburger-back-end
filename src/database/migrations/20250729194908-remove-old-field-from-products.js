
// src/database/migrations/xxxxxxx-remove-old-field-from-products.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, { DataTypes, Sequelize }) {
    // Remove a coluna 'old_field' da tabela 'products'
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface, { DataTypes, Sequelize }) {
    // Adiciona a coluna 'old_field' de volta se a migração for revertida
    // É importante definir as propriedades da coluna como ela era ANTES de ser removida
    await queryInterface.addColumn('products', 'category', {
      type: DataTypes.STRING, // Tipo de dado original
      allowNull: true,       // Propriedades originais
      // ... outras propriedades que a coluna tinha
    });
  },
};