/* eslint-disable prettier/prettier */
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('products', 'discount', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('products', 'discount');
}
