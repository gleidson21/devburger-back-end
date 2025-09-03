/**esse eo quarto que configuraçao*/
/**depois daqui eu vou gerar minhas migrations */

export default {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'devburger',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
