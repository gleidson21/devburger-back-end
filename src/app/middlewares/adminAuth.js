// src/app/middlewares/adminAuth.js

// Este middleware assume que o 'authMiddleware' (auth.js) já foi executado antes,
// e que ele adicionou 'req.userAdmin' à requisição.

function adminAuth(req, res, next) {
  // Verifica se o 'req.userAdmin' foi definido e se é 'true'
  // Se o 'authMiddleware' não rodou ou o token não decodificou 'admin', 'req.userAdmin' pode ser undefined/null/false
  if (req.userAdmin === true) {
    return next(); // Se for admin, continua para a próxima função (o controlador)
  } else {
    // Se não for admin, ou se 'req.userAdmin' não for true
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' }); // 403 Forbidden
  }
}

export default adminAuth;