// src/config/auth.js

export default {
  // ATENÇÃO: PARA PRODUÇÃO, ISSO DEVE VIR DE process.env.JWT_SECRET
  secret: 'a358a42316aac59ae0721a1b2ee2e49b', // <<<< COLOQUE AQUI SUA CHAVE SECRETA
  expiresIn: '7d', // Tempo de expiração do token (7 dias, por exemplo)
};