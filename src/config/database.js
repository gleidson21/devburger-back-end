/* eslint-disable prettier/prettier */
/**esse eo quarto que configuraçao*/
/**depois daqui eu vou gerar minhas migrations */

export default {
  dialect: 'postgres',
  url: process.env.DATABASE_URL,
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
}