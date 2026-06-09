import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class AuthService {
  static async register(username, email, password) {
    // Check if user already exists (by username or email)
    const existingUser = await UserRepository.findByUsernameOrEmail(username);
    const existingEmail = await UserRepository.findByUsernameOrEmail(email);

    if (existingUser || existingEmail) {
      // Determine which field is conflicting
      if (existingEmail && existingEmail.email === email) {
        throw new AppError('Email already exists', 409);
      }
      if (existingUser && existingUser.username === username) {
        throw new AppError('Username already exists', 409);
      }
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save to database
    try {
      const userId = await UserRepository.create(username, email, passwordHash);
      return userId;
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        if (error.message.includes('email')) {
          throw new AppError('Email already exists', 409);
        }
        if (error.message.includes('username')) {
          throw new AppError('Username already exists', 409);
        }
      }
      throw error;
    }
  }

  static async login(emailOrUsername, password) {
    const user = await UserRepository.findByUsernameOrEmail(emailOrUsername);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secret,
      { expiresIn: '24h' }
    );

    return { token, userId: user.id };
  }
}
