import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js'; // Importa as configurações do JWT (secret, expiresIn)

export default (req, res, next) => {
  // Pega o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  // 1. Verifica se o token foi enviado//
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O token vem no formato "Bearer SEU_TOKEN_AQUI"
  // Vamos separar o "Bearer" do token real
  const [, token] = authHeader.split(' '); // Divide a string e pega a segunda parte (o token)

  // 2. Verifica se o token é válido
  try {
    // Verifica o token usando o secret definido em authConfig
    const decoded = jwt.verify(token, authConfig.secret);

    // Se o token for válido, adiciona o ID do usuário e outras infos decodificadas
    // à requisição para que os próximos middlewares/controladores possam acessá-las
    req.userId = decoded.id;
    req.userAdmin = decoded.admin; // Se você quiser verificar se é admin

    // Continua para a próxima função (controlador ou outro middleware)
    return next();
  } catch (err) {
    // Se o token for inválido (expirado, modificado, etc.)
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
