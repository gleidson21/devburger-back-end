// src/database/migrations/xxxxxxx-add-path-to-categories-column-only.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, { DataTypes, Sequelize }) {
    // Adiciona a coluna 'path' à tabela 'categories'
    // Verifica se a coluna já existe antes de tentar adicionar, para evitar erros em re-runs
    const columns = await queryInterface.describeTable('categories');
    if (!columns.path) {
      await queryInterface.addColumn('categories', 'path', {
        type: DataTypes.STRING, // Tipo string para armazenar o nome do arquivo da imagem
        allowNull: true, // Permite que seja nulo (categorias podem não ter imagem)
        defaultValue: null, // Valor padrão nulo
      });
    }
  },

  async down(queryInterface, { Sequelize }) {
    // Remove a coluna 'path' em caso de rollback
    // Verifica se a coluna existe antes de tentar remover, para evitar erros em rollbacks
    const columns = await queryInterface.describeTable('categories');
    if (columns.path) {
      await queryInterface.removeColumn('categories', 'path');
    }
  },
  // eslint-disable-next-line prettier/prettier
}