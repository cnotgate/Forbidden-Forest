import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DATABASE_URL:
		process.env.DATABASE_URL ||
		'postgresql://postgres:postgrespassword@localhost:5432/doctortracker?schema=public',
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'doctor_tracker_access_secret_2026_hogwarts',
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'doctor_tracker_refresh_secret_2026_hogwarts',
	ACCESS_TOKEN_EXPIRES_IN: '15m',
	REFRESH_TOKEN_EXPIRES_IN: '14d',
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
