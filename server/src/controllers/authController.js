import { db } from '../db/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return errorResponse(res, 409, 'An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(password);
    const newUser = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      theme: 'dark',
    });

    const token = generateToken({ id: newUser.id, email: newUser.email });
    res.cookie('taskflow_token', token, COOKIE_OPTIONS);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      theme: newUser.theme,
      createdAt: newUser.createdAt,
    };

    return successResponse(res, 201, 'Account created successfully', {
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const token = generateToken({ id: user.id, email: user.email });
    res.cookie('taskflow_token', token, COOKIE_OPTIONS);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      theme: user.theme || 'dark',
      createdAt: user.createdAt,
    };

    return successResponse(res, 200, 'Logged in successfully', {
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('taskflow_token', COOKIE_OPTIONS);
  return successResponse(res, 200, 'Logged out successfully');
};

export const getMe = async (req, res) => {
  return successResponse(res, 200, 'Current user retrieved', {
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, theme } = req.body;
    const updated = await db.updateUser(req.user.id, { name, theme });
    return successResponse(res, 200, 'Profile updated successfully', {
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};
