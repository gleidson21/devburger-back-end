/* eslint-disable prettier/prettier */
import { DataTypes, Model } from 'sequelize';

class Product extends Model {
  static initModel(sequelize) {
    super.init({
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      path: DataTypes.STRING,
      offer: DataTypes.BOOLEAN
    }, {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  }
}

export default Product;

