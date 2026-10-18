import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  registerUser,
  loginUser,
  googleAuthUser,
  verifyRefreshToken,
  generateTokens,
  updateUserProfile,
  deleteUserAccount
} from '../services/auth.service';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ENV } from '../config/env';

const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter')
});

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password harus diisi')
});

const cookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: (ENV.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
};

export async function handleRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await registerUser(validated.email, validated.password, validated.fullName);

    res.cookie('refresh_token', result.refreshToken, cookieOptions);

    return res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors[0]?.message || 'Validasi gagal'
      });
    }
    next(err);
  }
}

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await loginUser(validated.email, validated.password);

    res.cookie('refresh_token', result.refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors[0]?.message || 'Validasi gagal'
      });
    }
    next(err);
  }
}

export async function handleGoogleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token (credential) diperlukan.'
      });
    }

    const result = await googleAuthUser(credential);
    res.cookie('refresh_token', result.refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Login dengan Google gagal.'
    });
  }
}

export async function handleRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak ditemukan'
      });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    const tokens = generateTokens({ userId: user.id, email: user.email });
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isOnboarded: user.isOnboarded
        }
      }
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Sesi kedaluwarsa. Silakan login kembali.'
    });
  }
}

export async function handleLogout(req: Request, res: Response) {
  res.clearCookie('refresh_token', cookieOptions);
  return res.status(200).json({
    success: true,
    message: 'Berhasil keluar.'
  });
}

export async function handleGetMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        googleId: true,
        isOnboarded: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { fullName } = req.body;
    if (!fullName || typeof fullName !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap harus diisi.'
      });
    }

    const updatedUser = await updateUserProfile(req.userId!, fullName);

    return res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: 'Profil berhasil diperbarui.'
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Gagal memperbarui profil.'
    });
  }
}

export async function handleDeleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak.'
      });
    }

    await deleteUserAccount(req.userId);

    // Clear refresh token cookie
    res.clearCookie('refresh_token', cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Akun dan seluruh data Anda telah berhasil dihapus secara permanen.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal menghapus akun.'
    });
  }
}

