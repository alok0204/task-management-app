import { db } from '../db/prisma.js';
import { successResponse } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await db.getUserStats(req.user.id);
    return successResponse(res, 200, 'User statistics retrieved', { stats });
  } catch (error) {
    next(error);
  }
};
