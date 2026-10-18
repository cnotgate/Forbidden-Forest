import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { ENV } from '../config/env';
import { seedUserTemplate } from './template.service';

export interface TokenPayload {
	userId: string;
	email: string;
}

export function generateTokens(payload: TokenPayload) {
	const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
		expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as any,
	});

	const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
		expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as any,
	});

	return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
	return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
	return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as TokenPayload;
}

export async function registerUser(email: string, password: string, fullName: string) {
	const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
	if (existing) {
		throw new Error('Email sudah terdaftar. Silakan login atau gunakan email lain.');
	}

	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(password, salt);

	const user = await prisma.user.create({
		data: {
			email: email.toLowerCase().trim(),
			passwordHash,
			fullName: fullName.trim(),
			isOnboarded: false,
		},
	});

	// Seed user template data immediately
	await seedUserTemplate(user.id);

	const tokens = generateTokens({ userId: user.id, email: user.email });

	return {
		user: {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			isOnboarded: user.isOnboarded,
		},
		...tokens,
	};
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    throw new Error('Email atau password tidak valid.');
  }

  if (!user.passwordHash) {
    throw new Error('Akun ini terdaftar melalui Akun Google. Silakan masuk menggunakan tombol "Lanjutkan dengan Google".');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Email atau password tidak valid.');
  }

  const tokens = generateTokens({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isOnboarded: user.isOnboarded,
    },
    ...tokens,
  };
}

export async function googleAuthUser(credential: string) {
  // Verify token via Google OAuth2 tokeninfo endpoint
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  if (!res.ok) {
    throw new Error('Verifikasi token Google gagal. Sesi Google tidak valid.');
  }

  const payload: any = await res.json();
  const email = payload.email?.toLowerCase().trim();
  const sub = payload.sub; // Google Unique ID
  const name = payload.name || payload.given_name || 'Dokter Muda';
  const picture = payload.picture || null;

  if (!email) {
    throw new Error('Email tidak ditemukan dari akun Google.');
  }

  // Find existing user by googleId or email
  let user: any = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: sub } as any,
        { email }
      ]
    }
  });

  if (user) {
    // Update googleId and avatarUrl if not linked yet
    if (!user.googleId || !user.avatarUrl) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || sub,
          avatarUrl: user.avatarUrl || picture
        } as any
      });
    }
  } else {
    // Create new user with Google account
    user = await prisma.user.create({
      data: {
        email,
        fullName: name,
        googleId: sub,
        avatarUrl: picture,
        isOnboarded: false
      } as any
    });

    // Seed default template data
    await seedUserTemplate(user.id);
  }

  const tokens = generateTokens({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isOnboarded: user.isOnboarded,
      avatarUrl: user.avatarUrl
    },
    ...tokens
  };
}

export async function updateUserProfile(userId: string, fullName: string) {
  const trimmed = fullName.trim();
  if (trimmed.length < 2) {
    throw new Error('Nama lengkap minimal 2 karakter.');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { fullName: trimmed },
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

  return updated;
}

export async function deleteUserAccount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('Pengguna tidak ditemukan.');
  }

  // Prisma cascade will automatically remove all dashboard_settings, clerkship_phases,
  // leveling_states, roadmap_weeks, intensif_days, skdi_systems, tryouts,
  // error_book_items, osce_skills, habits, daily_habit_logs, and guidelines.
  await prisma.user.delete({
    where: { id: userId }
  });

  return true;
}
