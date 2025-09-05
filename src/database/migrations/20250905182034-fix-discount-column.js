/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async ({ context }) => {
  const { queryInterface, Sequelize } = context;

  await queryInterface.addColumn('products', 'discount', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  });
};

export const down = async ({ context }) => {
  const { queryInterface } = context;

  await queryInterface.removeColumn('products', 'discount');
};
