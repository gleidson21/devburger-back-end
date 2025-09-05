/* eslint-disable prettier/prettier */
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // cuidado: em produção, o ideal é usar um certificado válido
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
});

export default sequelize;
