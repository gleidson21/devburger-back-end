'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, { DataTypes }) {
    // Adiciona a coluna 'discount' à tabela 'products'
    await queryInterface.addColumn('products', 'discount', {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode ser null no início
      defaultValue: 0, // Valor padrão
    });
  },

  async down(queryInterface) {
    // Remove a coluna 'discount' se a migração for revertida
    await queryInterface.removeColumn('products', 'discount');
  },
};
