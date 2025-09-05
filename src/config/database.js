import dotenv from 'dotenv';
dotenv.config();
export default {
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
