// Date helper utilities

export function formatDateIndo(dateStr: string): string {
	if (!dateStr) return '-';
	try {
		const parts = dateStr.split('-');
		if (parts.length === 3) {
			const year = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const day = parseInt(parts[2], 10);
			const d = new Date(year, month, day);
			return d.toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			});
		}
		return dateStr;
	} catch {
		return dateStr;
	}
}

export function formatDateWithDay(dateStr: string): string {
	if (!dateStr) return '-';
	try {
		const parts = dateStr.split('-');
		if (parts.length === 3) {
			const year = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const day = parseInt(parts[2], 10);
			const d = new Date(year, month, day);
			return d.toLocaleDateString('id-ID', {
				weekday: 'short',
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			});
		}
		return dateStr;
	} catch {
		return dateStr;
	}
}

export function getDaysRemaining(targetDateStr: string): number {
	if (!targetDateStr) return 0;
	try {
		const parts = targetDateStr.split('-');
		const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
		const now = new Date();
		// Reset time of today
		now.setHours(0, 0, 0, 0);
		const diffTime = target.getTime() - now.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	} catch {
		return 0;
	}
}

export function addDaysToDateStr(dateStr: string, daysToAdd: number): string {
	try {
		const parts = dateStr.split('-');
		const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
		d.setDate(d.getDate() + daysToAdd);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	} catch {
		return dateStr;
	}
}

export function getDayNameIndo(dateStr: string): string {
	try {
		const parts = dateStr.split('-');
		const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
		const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
		return days[d.getDay()];
	} catch {
		return '';
	}
}

export function isPhaseMatchingRotation(phaseName: string, rotationName: string): boolean {
	if (!phaseName || !rotationName) return false;
	const p = phaseName.toLowerCase().trim();
	const r = rotationName.toLowerCase().trim();
	if (p === r) return true;
	if (p.length >= 4 && r.length >= 4 && (p.includes(r) || r.includes(p))) return true;
	if ((p.includes('ikm') || p.includes('kkt')) && (r.includes('ikm') || r.includes('kkt'))) return true;
	if ((p.includes('pass 2') || p.includes('pasca-koas')) && (r.includes('pass 2') || r.includes('pasca-koas'))) return true;
	if (p.includes('intensif') && r.includes('intensif')) return true;
	return false;
}

export function isCurrentDateInRange(startStr: string, endStr: string): boolean {
	if (!startStr || !endStr) return false;
	const today = new Date().toISOString().slice(0, 10);
	return today >= startStr && today <= endStr;
}

export function sortPhasesChronologically<T extends { startDate?: string; endDate?: string; id?: string }>(phases: T[]): T[] {
	if (!Array.isArray(phases)) return [];
	return [...phases].sort((a, b) => {
		if (a.startDate && b.startDate) {
			const cmp = a.startDate.localeCompare(b.startDate);
			if (cmp !== 0) return cmp;
		} else if (a.startDate && !b.startDate) {
			return -1;
		} else if (!a.startDate && b.startDate) {
			return 1;
		}

		if (a.endDate && b.endDate) {
			const cmp = a.endDate.localeCompare(b.endDate);
			if (cmp !== 0) return cmp;
		}

		if (a.id && b.id) {
			const numA = parseInt(a.id.replace(/\D/g, ''), 10);
			const numB = parseInt(b.id.replace(/\D/g, ''), 10);
			if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
				return numA - numB;
			}
			return a.id.localeCompare(b.id);
		}

		return 0;
	});
}

