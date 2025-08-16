
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not configured on server' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Token payload is invalid or missing userId' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export default authMiddleware;