import React, { useState, useMemo } from 'react';
import { DailyHabitLog, HabitItem } from '../types';
import { BarChart3, TrendingUp, Calendar, CheckCircle2, Flame, Award, ChevronRight } from 'lucide-react';
import { formatDateIndo, formatDateWithDay } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';

interface Props {
  dailyHabitLogs: Record<string, DailyHabitLog>;
  habits: HabitItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

type RangeOption = '7d' | '14d' | '30d' | 'month';

export const HabitCompletionChart: React.FC<Props> = ({
  dailyHabitLogs,
  habits,
  selectedDate,
  onSelectDate
}) => {
  const [range, setRange] = useState<RangeOption>('7d');

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Generate date list based on selected range
  const dates = useMemo(() => {
    const ref = new Date();
    const result: string[] = [];

    if (range === 'month') {
      const year = ref.getFullYear();
      const month = ref.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        result.push(`${y}-${m}-${dayStr}`);
      }
      return result;
    }

    let count = 7;
    if (range === '14d') count = 14;
    if (range === '30d') count = 30;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      result.push(`${y}-${m}-${dayStr}`);
    }

    return result;
  }, [range]);

  const totalHabitsCount = habits.length || 1;

  // Compute daily metrics
  const chartData = useMemo(() => {
    return dates.map(dStr => {
      const log = dailyHabitLogs[dStr];
      const doneCount = log ? (log.habitsDone || []).length : 0;
      const rate = Math.min(100, Math.round((doneCount / totalHabitsCount) * 100));
      const level = log ? log.level : undefined;
      const note = log?.note;

      const dateObj = new Date(dStr);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
      const dayNum = dateObj.getDate();
      const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short' });

      return {
        dateStr: dStr,
        doneCount,
        rate,
        level,
        note,
        dayName,
        dayNum,
        monthName,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedDate
      };
    });
  }, [dates, dailyHabitLogs, totalHabitsCount, selectedDate, todayStr]);

  // Aggregate stats
  const stats = useMemo(() => {
    if (chartData.length === 0) return { avg: 0, activeDays: 0, perfectDays: 0, totalDone: 0 };
    const totalRates = chartData.reduce((acc, c) => acc + c.rate, 0);
    const avg = Math.round(totalRates / chartData.length);
    const activeDays = chartData.filter(c => c.doneCount > 0 || c.level !== undefined).length;
    const perfectDays = chartData.filter(c => c.rate === 100).length;
    const totalDone = chartData.reduce((acc, c) => acc + c.doneCount, 0);

    return { avg, activeDays, perfectDays, totalDone };
  }, [chartData]);

  const rangeLabels: Record<RangeOption, string> = {
    '7d': '7 Hari Terakhir',
    '14d': '14 Hari Terakhir',
    '30d': '30 Hari Terakhir',
    month: 'Bulan Ini'
  };

  return (
    <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-hogwarts-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-900 border-2 border-teal-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-hogwarts-950 flex items-center gap-2">
              Grafik Tren Kelulusan Ritual
              <span className="text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full bg-hogwarts-100 text-hogwarts-900 border border-hogwarts-300">
                {rangeLabels[range]}
              </span>
            </h3>
            <p className="text-xs text-hogwarts-700 font-medium">
              Pantau konsistensi ritual harianmu. Klik batang untuk melompat ke tanggal evaluasi.
            </p>
          </div>
        </div>

        {/* Range Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-[#faf6ee] p-1 rounded-2xl border-2 border-hogwarts-300 self-start sm:self-auto">
          {(['7d', '14d', '30d', 'month'] as RangeOption[]).map(r => (
            <button
              key={r}
              onClick={() => {
                sounds.playClick();
                setRange(r);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                range === r
                  ? 'bg-teal-100/90 text-teal-950 border-2 border-teal-600 shadow-xs'
                  : 'text-hogwarts-800 hover:text-hogwarts-950 hover:bg-[#fdfcf9]'
              }`}
            >
              {r === '7d' ? '7 Hari' : r === '14d' ? '14 Hari' : r === '30d' ? '30 Hari' : 'Bulan Ini'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-teal-50/70 border-2 border-teal-200 shadow-xs">
          <div className="text-[10px] font-bold text-teal-800 font-serif uppercase">Rata-Rata Sukses</div>
          <div className="font-serif text-lg font-bold text-teal-950 flex items-baseline gap-1 mt-0.5">
            {stats.avg}%
            <span className="text-[10px] font-sans font-medium text-teal-700">target ritual</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 border-2 border-amber-200 shadow-xs">
          <div className="text-[10px] font-bold text-amber-800 font-serif uppercase">Hari Aktif Belajar</div>
          <div className="font-serif text-lg font-bold text-amber-950 flex items-baseline gap-1 mt-0.5">
            {stats.activeDays}
            <span className="text-[10px] font-sans font-medium text-amber-700">/ {chartData.length} hari</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-800 font-serif uppercase">Hari 100% Sempurna</div>
          <div className="font-serif text-lg font-bold text-emerald-950 flex items-baseline gap-1 mt-0.5">
            {stats.perfectDays}
            <span className="text-[10px] font-sans font-medium text-emerald-700">hari master 👑</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-purple-50/70 border-2 border-purple-200 shadow-xs">
          <div className="text-[10px] font-bold text-purple-800 font-serif uppercase">Total Ritual Tuntas</div>
          <div className="font-serif text-lg font-bold text-purple-950 flex items-baseline gap-1 mt-0.5">
            {stats.totalDone}
            <span className="text-[10px] font-sans font-medium text-purple-700">habit tuntas</span>
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart Canvas */}
      <div className="relative pt-4 pb-2">
        {/* Horizontal Guide Grid Lines */}
        <div className="absolute inset-x-0 top-4 bottom-14 flex flex-col justify-between pointer-events-none text-[9px] text-hogwarts-400 font-mono">
          <div className="border-b border-dashed border-hogwarts-200/80 flex justify-end pr-1">100%</div>
          <div className="border-b border-dashed border-hogwarts-200/60 flex justify-end pr-1">75%</div>
          <div className="border-b border-dashed border-hogwarts-200/60 flex justify-end pr-1">50%</div>
          <div className="border-b border-dashed border-hogwarts-200/60 flex justify-end pr-1">25%</div>
          <div className="border-b border-hogwarts-300 flex justify-end pr-1">0%</div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 h-44 sm:h-52 flex items-end justify-between gap-1 sm:gap-2 px-2 overflow-x-auto pb-8 pt-2">
          {chartData.map((d) => {
            // Bar background color based on completion tier
            let barBg = 'bg-stone-200 border-dashed border-stone-300';
            let barGlow = '';
            if (d.rate === 100) {
              barBg = 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 border-emerald-600';
              barGlow = 'ring-2 ring-emerald-400/40';
            } else if (d.rate >= 75) {
              barBg = 'bg-gradient-to-t from-teal-600 to-teal-400 border-teal-600';
              barGlow = 'ring-2 ring-teal-400/40';
            } else if (d.rate >= 40) {
              barBg = 'bg-gradient-to-t from-amber-600 to-amber-400 border-amber-600';
              barGlow = 'ring-2 ring-amber-400/40';
            } else if (d.rate > 0) {
              barBg = 'bg-gradient-to-t from-sky-600 to-sky-400 border-sky-500';
            }

            const levelIcon = d.level === 0 ? '🌙' : d.level === 1 ? '🌿' : d.level === 2 ? '⚡' : null;

            return (
              <div
                key={d.dateStr}
                onClick={() => {
                  sounds.playClick();
                  onSelectDate(d.dateStr);
                }}
                className="relative flex-1 min-w-[24px] sm:min-w-[32px] max-w-[56px] h-full flex flex-col justify-end items-center cursor-pointer transition-all active:scale-95"
              >
                {/* Mode Indicator or Star above bar */}
                <div className="mb-1 text-[11px] h-4 flex items-center justify-center shrink-0">
                  {d.rate === 100 ? (
                    <span className="text-amber-600 animate-bounce">👑</span>
                  ) : levelIcon ? (
                    <span className="text-[10px] opacity-80">{levelIcon}</span>
                  ) : null}
                </div>

                {/* The Bar */}
                <div
                  className={`w-full rounded-t-xl border-2 transition-all duration-200 relative ${barBg} ${
                    d.isSelected
                      ? 'ring-4 ring-tiffany-500/70 shadow-md scale-105 z-20'
                      : barGlow
                  }`}
                  style={{
                    height: d.rate > 0 ? `${Math.max(d.rate, 12)}%` : '8px'
                  }}
                >
                  {/* Rate label inside bar if tall enough */}
                  {d.rate >= 45 && (
                    <span className="absolute inset-x-0 top-1 text-center text-[9px] font-black text-white drop-shadow-xs">
                      {d.rate}%
                    </span>
                  )}
                </div>

                {/* X-Axis Day & Date Label */}
                <div className="absolute -bottom-6 text-center whitespace-nowrap">
                  <div className={`text-[10px] font-serif font-bold ${
                    d.isSelected
                      ? 'text-teal-950 underline font-black'
                      : d.isToday
                      ? 'text-tiffany-900 font-extrabold'
                      : 'text-hogwarts-800'
                  }`}>
                    {d.dayName}
                  </div>
                  <div className={`text-[9px] ${
                    d.isSelected ? 'font-bold text-teal-900' : 'text-hogwarts-600'
                  }`}>
                    {d.dayNum}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

