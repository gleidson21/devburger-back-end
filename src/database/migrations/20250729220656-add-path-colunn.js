'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'categories',
      'path',

      {
        type: Sequelize.STRING,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories', 'path');
  },
};
