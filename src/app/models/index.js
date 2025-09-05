/* eslint-disable prettier/prettier */
import sequelize from '../../config/database.js';
import Category from './Category.js';
import Product from './product.js';

Category.init(sequelize);
Product.init(sequelize);

Category.associate({ Product });
Product.associate({ Category });

export { Category, Product };

