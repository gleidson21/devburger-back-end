/* eslint-disable prettier/prettier */
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

const sequelize = new Sequelize(connectionString, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, 'src', 'database', 'migrations', '*.js'),
  },
  context: sequelize,
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await umzug.up();
    console.log('Migrations finished successfully!');
  } catch (error) {
    console.error('Migrations failed:', error);
    throw error;
  }
}

runMigrations();