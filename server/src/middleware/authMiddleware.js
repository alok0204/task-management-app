import { verifyToken } from '../utils/jwt.js';
import { db } from '../db/prisma.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.taskflow_token) {
      token = req.cookies.taskflow_token;
    }

    if (!token) {
      return errorResponse(res, 401, 'Authentication required. No token provided.');
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return errorResponse(res, 401, 'Invalid or expired session token.');
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'User associated with this session no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return errorResponse(res, 500, 'Authentication error.');
  }
};
