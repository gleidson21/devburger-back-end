/* eslint-disable prettier/prettier */
import 'dotenv/config';
import sequelize from '../config/database.js';
import { Category, Product } from '../app/models/index.js';

async function seed() {
  try {
    await sequelize.sync({ force: true });

    // Categorias com IDs fixos
    await Category.bulkCreate([
      { id: 1, name: 'Entradas', path: '049be9ba-ced8-4486-9015-0e3ed1c3cd3b.png' },
      { id: 2, name: 'Hambúrgueres', path: 'c3bd7993-fa8b-4978-ae94-afe0cddeb1b8.png' },
      { id: 3, name: 'Bebidas', path: '1a2e11dd-9624-461f-b2b1-52265175a6f1.png' },
      { id: 4, name: 'Sobremesas', path: '490c2de7-112b-40d6-881b-86f8ac6bfa8a.png' }
    ]);

    // Produtos agrupados por categoria
    await Product.bulkCreate([
      // Entradas
      { name: 'Bruschetta', price: 2590, path: '338562f9-dc29-402c-b316-26fd342a91c8.png', offer: false, category_id: 1 },
      { name: 'Croquete de carne', price: 2390, path: '42bcfbf4-e475-442d-be94-bb16f99bf775.png', offer: true, category_id: 1 },
      { name: 'Tábua de frios', price: 6990, path: '4c287e41-2f8d-484f-8d61-5ecf5ac206bb.png', offer: false, category_id: 1 },
      { name: 'Ceviche tropical', price: 4500, path: '6d391aa7-0a80-4570-9c88-b0d99ed2a6d9.png', offer: true, category_id: 1 },

      // Hambúrgueres
      { name: 'X-Burger', price: 1990, path: 'c3bd7993-fa8b-4978-ae94-afe0cddeb1b8.png', offer: true, category_id: 2 },
      { name: 'X-Bacon', price: 2490, path: '8ae668dd-d713-4b96-8ec1-7526b3e8bd2f.png', offer: false, category_id: 2 },
      { name: 'X-Tudo', price: 2990, path: '787b540c-72e7-406e-b1c3-082827aec0fd.png', offer: true, category_id: 2 },
      { name: 'X-Salada', price: 2190, path: 'a1b2be9b-5a7f-498c-92da-5a676d86b79f.png', offer: false, category_id: 2 },

      // Bebidas
      { name: 'Refrigerante', price: 590, path: '1a2e11dd-9624-461f-b2b1-52265175a6f1.png', offer: true, category_id: 3 },
      { name: 'Suco natural', price: 1190, path: '9c104b2c-3ac9-4d35-a7a4-f11ab8dff65e.png', offer: false, category_id: 3 },
      { name: 'Água com gás', price: 490, path: '20cd0bcc-9e90-4a5a-a1ef-11e780833a23.png', offer: false, category_id: 3 },
      { name: 'Chá gelado', price: 790, path: '880d9b7a-03dd-4977-a181-963998e138e4.png', offer: true, category_id: 3 },

      // Sobremesas
      { name: 'Sorvete', price: 1690, path: '490c2de7-112b-40d6-881b-86f8ac6bfa8a.png', offer: true, category_id: 4 },
      { name: 'Pudim', price: 1290, path: '4f6a1ecc-faea-4131-8cc8-6be365d5927b.png', offer: false, category_id: 4 },
      { name: 'Cheesecake', price: 2290, path: '512df38e-6a69-4ab2-84e6-8d2cbfd81992.png', offer: false, category_id: 4 },
      { name: 'Gelatina', price: 690, path: 'eba64908-7732-4510-804c-b635c13d9942.png', offer: true, category_id: 4 }
    ]);

    console.log('✅ Seed executado com sucesso!');
    process.exit();
  } catch (err) {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  }
}

seed();
