// auth-middleware.js
module.exports = function(req, res, next) {
    // Разрешаем GET-запросы без проверки
    if (req.method === 'GET') return next();
    
    // Проверяем авторизацию для других методов
    const authToken = req.headers.authorization;
    if (!authToken || authToken !== 'secret-token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  module.exports = (req, res, next) => {
    // Для DELETE /passwords/:id
    if (req.method === 'DELETE' && req.path.startsWith('/passwords/')) {
      const authHeader = req.headers['authorization'];
      if (!authHeader || authHeader !== 'secret-token') {
        console.log('Invalid token:', authHeader);
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    next();
  };