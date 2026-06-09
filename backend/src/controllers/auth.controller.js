import { AuthService } from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const userId = await AuthService.register(username, email, password);
    res.status(201).json({
      message: 'User registered successfully',
      userId
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { emailOrUsername, password } = req.body;
    const result = await AuthService.login(emailOrUsername, password);
    res.status(200).json({
      token: result.token,
      userId: result.userId
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    res.status(200).json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
}
