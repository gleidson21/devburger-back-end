import 'dotenv/config';
import { parse } from 'pg-connection-string';

const config = parse(process.env.DATABASE_URL);

export default {
  development: {
    dialect: 'postgres',
    host: config.host,
    port: Number(config.port),
    username: config.user,
    password: config.password,
    database: config.database,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
