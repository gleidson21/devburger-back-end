/* eslint-disable prettier/prettier */
import sequelize from '../../config/database.js';
import Category from './Category.js';
import Product from './product.js';

Category.initModel(sequelize);
Product.initModel(sequelize);

Category.associate({ Product });
Product.associate({ Category });

export { Category, Product };

