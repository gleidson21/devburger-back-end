/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('products', 'discount', {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('products', 'discount');
};
