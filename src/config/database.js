import dotenv from 'dotenv';
dotenv.config();
export default {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
