import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get from frontend header
  if (!authHeader) { 
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }
  
  // Format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // store userId in request
    next();
  } catch (err) { 
    console.warn(`JWT verification failed: ${err.message}`);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

export default authMiddleware;
