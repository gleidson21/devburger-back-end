/* eslint-disable prettier/prettier */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('products', 'discount', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('products', 'discount');
}
