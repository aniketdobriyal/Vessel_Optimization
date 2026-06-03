import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 401, message: 'Authentication required. Token is missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'vessel-optimization-secret-key-2026';
    
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, message: 'Authentication failed. Token is expired or invalid.' });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
}
