import { apiRequest } from './api.ts';

interface RegisterResponse {
  message: string;
  userId: number;
}

interface LoginResponse {
  token: string;
  userId: number;
}

export class AuthService {
  static async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>('/register', {
      method: 'POST',
      bodyData: { username, email, password }
    });
  }

  static async login(emailOrUsername: string, password: string): Promise<LoginResponse> {
    const res = await apiRequest<LoginResponse>('/login', {
      method: 'POST',
      bodyData: { emailOrUsername, password }
    });
    
    // Save token and userId to localStorage
    localStorage.setItem('token', res.token);
    localStorage.setItem('userId', res.userId.toString());
    
    return res;
  }

  static async logout(): Promise<void> {
    try {
      await apiRequest<any>('/logout', {
        method: 'POST'
      });
    } finally {
      // Always clear localStorage on logout, even if the backend request fails
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  static getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}
