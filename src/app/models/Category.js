// src/app/models/Category.js

import { DataTypes, Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.VIRTUAL,
          get() {
            return `http://localhost:3000/category-file/${this.path}`;
          },

          // created_at e updated_at são gerados automaticamente pelo Sequelize
          // se timestamps: true estiver definido abaixo.
        },
      },
      {
        sequelize,
        tableName: 'categories', // Nome da tabela no banco de dados
        timestamps: true, // Habilita created_at e updated_at
        underscored: true, // Usa snake_case para os nomes das colunas (created_at, updated_at)
      },
    );
  }
  static associate(models) {
    this.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
  }
}
export default Category;
