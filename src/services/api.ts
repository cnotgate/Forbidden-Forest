// Client API Service for Doctor Tracker
const API_BASE = '/api';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
	accessToken = token;
	if (token) {
		try {
			localStorage.setItem('doc_access_token', token);
		} catch {}
	} else {
		try {
			localStorage.removeItem('doc_access_token');
		} catch {}
	}
}

export function getAccessToken(): string | null {
	if (!accessToken) {
		try {
			accessToken = localStorage.getItem('doc_access_token');
		} catch {}
	}
	return accessToken;
}

export async function apiRequest<T = any>(
	endpoint: string,
	options: RequestInit = {},
): Promise<{ success: boolean; data?: T; message?: string }> {
	const token = getAccessToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {}),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const config: RequestInit = {
		...options,
		headers,
		credentials: 'include', // include httpOnly refresh cookie
	};

	try {
		let res = await fetch(`${API_BASE}${endpoint}`, config);

		// Auto-refresh token if 401 and we have a token
		if (res.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
			try {
				const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				});

				if (refreshRes.ok) {
					const refreshData = await refreshRes.json();
					if (refreshData.data?.accessToken) {
						setAccessToken(refreshData.data.accessToken);
						headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
						res = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
					}
				} else {
					setAccessToken(null);
				}
			} catch {
				setAccessToken(null);
			}
		}

		const data = await res.json();
		if (!res.ok) {
			return {
				success: false,
				message: data.message || `Request failed with status ${res.status}`,
			};
		}

		return data;
	} catch (err: any) {
		return {
			success: false,
			message: err.message || 'Koneksi ke server gagal. Periksa jaringan internetmu.',
		};
	}
}

export const authApi = {
	register: (payload: { email: string; password: string; fullName: string }) =>
		apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

	login: (payload: { email: string; password: string }) =>
		apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

	googleLogin: (credential: string) =>
		apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),

	refresh: () => apiRequest('/auth/refresh', { method: 'POST' }),

	getMe: () => apiRequest('/auth/me'),

	updateProfile: (payload: { fullName: string }) =>
		apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

	deleteAccount: () => apiRequest('/auth/account', { method: 'DELETE' }),

	logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

export const onboardingApi = {
	complete: (payload: {
		doctorNickname: string;
		doctorAvatar: string;
		companionMood: string;
		ddayUKMPPD?: string;
		targetCBT?: number;
		batasAman?: number;
	}) => apiRequest('/onboarding/complete', { method: 'POST', body: JSON.stringify(payload) }),
};

export const migrationApi = {
	importLocalStorage: (state: any) =>
		apiRequest('/migration/import-local', { method: 'POST', body: JSON.stringify(state) }),
};

export const trackerApi = {
	getState: () => apiRequest('/tracker/state'),

	syncState: (state: any) => apiRequest('/tracker/sync', { method: 'POST', body: JSON.stringify(state) }),

	updateDashboard: (settings: any, phases?: any[]) =>
		apiRequest('/tracker/dashboard', { method: 'PUT', body: JSON.stringify({ settings, phases }) }),

	// Roadmap (Granular)
	toggleRoadmapWeek: (weekNum: number, isDone: boolean, phaseUpdates?: any[]) =>
		apiRequest(`/tracker/roadmap/${weekNum}/toggle`, { method: 'PATCH', body: JSON.stringify({ isDone, phaseUpdates }) }),

	updateRoadmapWeek: (weekNum: number, updated: any) =>
		apiRequest(`/tracker/roadmap/${weekNum}`, { method: 'PUT', body: JSON.stringify(updated) }),

	addRoadmapWeek: (week: any) =>
		apiRequest('/tracker/roadmap', { method: 'POST', body: JSON.stringify(week) }),

	deleteRoadmapWeek: (weekNum: number) =>
		apiRequest(`/tracker/roadmap/${weekNum}`, { method: 'DELETE' }),

	batchSyncRoadmap: (roadmapWeeks: any[], phases: any[]) =>
		apiRequest('/tracker/roadmap', { method: 'PUT', body: JSON.stringify({ roadmapWeeks, phases }) }),

	// Intensif (Granular)
	toggleIntensifDay: (dayNum: number, isDone: boolean, phaseUpdates?: any[]) =>
		apiRequest(`/tracker/intensif/${dayNum}/toggle`, { method: 'PATCH', body: JSON.stringify({ isDone, phaseUpdates }) }),

	updateIntensifDay: (dayNum: number, updated: any) =>
		apiRequest(`/tracker/intensif/${dayNum}`, { method: 'PUT', body: JSON.stringify(updated) }),

	addIntensifDay: (day: any) =>
		apiRequest('/tracker/intensif', { method: 'POST', body: JSON.stringify(day) }),

	deleteIntensifDay: (dayNum: number) =>
		apiRequest(`/tracker/intensif/${dayNum}`, { method: 'DELETE' }),

	shiftIntensif: (intensifDays: any[]) =>
		apiRequest('/tracker/intensif/shift', { method: 'POST', body: JSON.stringify({ intensifDays }) }),

	// Habits (Granular)
	logHabit: (payload: { date: string; level: number; habitsDone: string[]; note?: string }) =>
		apiRequest('/tracker/habits/log', { method: 'POST', body: JSON.stringify(payload) }),

	addHabit: (habit: { id?: string; name: string; priority: string }) =>
		apiRequest('/tracker/habits', { method: 'POST', body: JSON.stringify(habit) }),

	updateHabit: (id: string, name: string, priority: string) =>
		apiRequest(`/tracker/habits/${id}`, { method: 'PUT', body: JSON.stringify({ name, priority }) }),

	deleteHabit: (id: string) =>
		apiRequest(`/tracker/habits/${id}`, { method: 'DELETE' }),

	// SKDI (Granular)
	toggleSKDIPass: (no: number, pass: 'p1' | 'p2' | 'p3', done: boolean) =>
		apiRequest(`/tracker/skdi/${no}/pass`, { method: 'PATCH', body: JSON.stringify({ pass, done }) }),

	updateSKDISystem: (no: number, updated: any) =>
		apiRequest(`/tracker/skdi/${no}`, { method: 'PUT', body: JSON.stringify(updated) }),

	addSKDISystem: (sys: any) =>
		apiRequest('/tracker/skdi', { method: 'POST', body: JSON.stringify(sys) }),

	deleteSKDISystem: (no: number) =>
		apiRequest(`/tracker/skdi/${no}`, { method: 'DELETE' }),

	// Error Book (Granular)
	addErrorEntry: (entry: any) =>
		apiRequest('/tracker/error-book', { method: 'POST', body: JSON.stringify(entry) }),

	updateErrorEntry: (id: string, updated: any) =>
		apiRequest(`/tracker/error-book/${id}`, { method: 'PUT', body: JSON.stringify(updated) }),

	deleteErrorEntry: (id: string) =>
		apiRequest(`/tracker/error-book/${id}`, { method: 'DELETE' }),

	// Tryouts (Granular)
	addTryout: (item: any) =>
		apiRequest('/tracker/tryouts', { method: 'POST', body: JSON.stringify(item) }),

	updateTryout: (no: number, updated: any) =>
		apiRequest(`/tracker/tryouts/${no}`, { method: 'PUT', body: JSON.stringify(updated) }),

	deleteTryout: (no: number) =>
		apiRequest(`/tracker/tryouts/${no}`, { method: 'DELETE' }),

	// OSCE (Granular)
	toggleOSCETask: (no: number, stage: 'pahami' | 'solo' | 'partner' | 'dinilai', done: boolean) =>
		apiRequest(`/tracker/osce/${no}/toggle`, { method: 'PATCH', body: JSON.stringify({ stage, done }) }),

	updateOSCESkill: (no: number, updated: any) =>
		apiRequest(`/tracker/osce/${no}`, { method: 'PUT', body: JSON.stringify(updated) }),

	addOSCESkill: (skill: any) =>
		apiRequest('/tracker/osce', { method: 'POST', body: JSON.stringify(skill) }),

	deleteOSCESkill: (no: number) =>
		apiRequest(`/tracker/osce/${no}`, { method: 'DELETE' }),

	// Leveling (Granular)
	updateLeveling: (payload: { levels?: any[]; badges?: any[]; xpRules?: any[] }) =>
		apiRequest('/tracker/leveling', { method: 'PUT', body: JSON.stringify(payload) })
};
