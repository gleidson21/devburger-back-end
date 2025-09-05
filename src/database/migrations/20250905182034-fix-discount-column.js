/* eslint-disable prettier/prettier */
'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  await queryInterface.addColumn('products', 'discount', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('products', 'discount');
};
