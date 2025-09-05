/* eslint-disable prettier/prettier */
import 'dotenv/config';
import sequelize from '../config/database.js';
import { Category, Product } from '../app/models/index.js';

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const categorias = await Category.bulkCreate([
      { name: 'Hamburgueres', path: '7a46cd75-f312-48aa-9edd-b4890a1df091.jpg' },
      { name: 'Bebidas', path: '0d9973fb-7eda-4652-8d33-a863631a0333.jpg' },
      { name: 'Sobremesas', path: '73015117-22b0-4044-8561-a431e91caea8.jpg' },
      { name: 'Entradas', path: 'ceb5cd11-d629-452e-8ea4-ae0b922bed40.jpg' }
    ]);

    await Product.bulkCreate([
      {
        name: 'X-Burger',
        price: 19.90,
        path: '7a46cd75-f312-48aa-9edd-b4890a1df091.jpg',
        offer: true,
        category_id: categorias[1].id
      },
      {
        name: 'Refrigerante',
        price: 6.50,
        path: '0d9973fb-7eda-4652-8d33-a863631a0333.jpg',
        offer: true,
        category_id: categorias[2].id
      },
      {
        name: 'Sorvete',
        price: 12.00,
        path: '73015117-22b0-4044-8561-a431e91caea8.jpg',
        offer: true,
        category_id: categorias[3].id
      }
    ]);

    console.log('✅ Seed executado com sucesso!');
    process.exit();
  } catch (err) {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  }
}

seed();
