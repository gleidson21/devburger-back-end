/* eslint-disable prettier/prettier */
import { DataTypes, Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.VIRTUAL,
        get() {
          return `https://devburger-back-end.onrender.com/category-file/${this.path}`;
        }
      }
    }, {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
      underscored: true
    });
  }

  static associate(models) {
    this.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products'
    });
  }
}

export default Category;
