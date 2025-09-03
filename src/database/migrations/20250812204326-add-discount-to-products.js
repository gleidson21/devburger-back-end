'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'discount', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true, // Ou false, se a coluna for obrigatória
      defaultValue: 0, // Um valor padrão é uma boa prática
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'discount');
  },
};
