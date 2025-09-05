/* eslint-disable prettier/prettier */
import sequelize from '../../config/database.js';
import Category from './Category.js';
import Product from './product.js';

Category.init(sequelize);
Product.init(sequelize);

const models = { Category, Product };

Category.associate(models);
Product.associate(models);

export { Category, Product };

