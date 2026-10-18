import React, { useState, useEffect, useRef } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  Sparkles,
  GripVertical,
  X,
  Compass
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';

export interface RealmDefinition {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  defaultTab: string;
  subTabs: { id: string; label: string; icon: string; desc: string }[];
}

export const realms: RealmDefinition[] = [
  {
    id: 'sanctum',
    name: 'Sanctum Dokter',
    shortName: 'Sanctum',
    icon: '🏛️',
    defaultTab: 'dashboard',
    subTabs: [
      { id: 'dashboard', label: 'Markas & Status', icon: '🏛️', desc: 'Ringkasan progres & stase' },
      { id: 'leveling', label: 'Tingkat & Hadiah', icon: '👑', desc: '11 Hierarki level & Self-Reward' },
    ]
  },
  {
    id: 'ekspedisi',
    name: 'Peta Petualangan',
    shortName: 'Ekspedisi',
    icon: '🗺️',
    defaultTab: 'roadmap',
    subTabs: [
      { id: 'roadmap', label: 'Peta 56 Mgg Stase', icon: '📜', desc: 'Quest mingguan rotasi koas' },
      { id: 'intensif', label: 'Ekspedisi 70 Hari', icon: '⏳', desc: 'Jadwal H-70 s/d D-Day UKMPPD' },
    ]
  },
  {
    id: 'grimoire',
    name: 'Grimoire Medis',
    shortName: 'Grimoire',
    icon: '🔮',
    defaultTab: 'skdi',
    subTabs: [
      { id: 'skdi', label: '20 Sistem SKDI', icon: '🔮', desc: '3-Star spiral spaced learning' },
      { id: 'error-book', label: 'Grimoire Error', icon: '📖', desc: 'Bedah soal salah & review' },
    ]
  },
  {
    id: 'arena',
    name: 'Arena Ujian',
    shortName: 'Arena',
    icon: '🎯',
    defaultTab: 'tryout',
    subTabs: [
      { id: 'tryout', label: '10 Boss Tryout', icon: '🎯', desc: 'Pertarungan skor CBT target 100' },
      { id: 'osce', label: 'Skill Tree OSCE', icon: '🩺', desc: '35 Stasiun keterampilan klinis' },
    ]
  },
  {
    id: 'sanctuary',
    name: 'Ruang Ritual',
    shortName: 'Ritual',
    icon: '☕',
    defaultTab: 'habit',
    subTabs: [
      { id: 'habit', label: 'Ritual & Energi', icon: '☕', desc: '3 Level energi koas anti-burnout' },
      { id: 'guidelines', label: 'Doktrin Healer', icon: '📜', desc: 'Pedoman belajar & nalar Sokrates' },
    ]
  }
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 190;
const MAX_WIDTH = 420;
const COLLAPSED_WIDTH = 68;

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed
}) => {
  // Saved width in localStorage
  const [width, setWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('doctor_tracker_sidebar_width');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_WIDTH;
  });

  // Local Collapsed state (used if external not provided)
  const [localIsCollapsed, setLocalIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('doctor_tracker_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const currentCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : localIsCollapsed;
  const setCollapsedState = externalSetIsCollapsed || setLocalIsCollapsed;

  // Detect mobile screen (< 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveCollapsed = isMobile ? false : currentCollapsed;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Active realm detection
  const activeRealm = realms.find(r => r.subTabs.some(st => st.id === activeTab)) || realms[0];

  // Accordion state: by default, all realms are expanded for instant discoverability
  const [expandedRealms, setExpandedRealms] = useState<Record<string, boolean>>({
    sanctum: true,
    ekspedisi: true,
    grimoire: true,
    arena: true,
    sanctuary: true
  });

  const toggleRealmAccordion = (realmId: string) => {
    sounds.playClick();
    setExpandedRealms(prev => ({
      ...prev,
      [realmId]: !prev[realmId]
    }));
  };

  const handleToggleCollapse = () => {
    sounds.playClick();
    const nextVal = !currentCollapsed;
    setCollapsedState(nextVal);
    try {
      localStorage.setItem('doctor_tracker_sidebar_collapsed', String(nextVal));
    } catch {}
  };

  const handleSelectTab = (tabId: string) => {
    sounds.playClick();
    setActiveTab(tabId);
    // On mobile, automatically close drawer after picking
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Mouse drag handler for horizontal resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDoubleClickHandle = () => {
    sounds.playClick();
    setWidth(DEFAULT_WIDTH);
    try {
      localStorage.setItem('doctor_tracker_sidebar_width', String(DEFAULT_WIDTH));
    } catch {}
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - rect.left));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      try {
        localStorage.setItem('doctor_tracker_sidebar_width', String(width));
      } catch {}
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, width]);

  // Actual rendered width
  const currentWidth = isMobile
    ? Math.min(Math.max(width, 280), 320)
    : (effectiveCollapsed ? COLLAPSED_WIDTH : width);

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        ref={sidebarRef}
        style={{
          width: `${currentWidth}px`
        }}
        className={`
          fixed md:sticky top-0 md:top-[65px] z-50 md:z-30
          h-screen md:h-[calc(100vh-65px)]
          bg-[#faf6ee] dark:bg-[#161310]
          border-r-2 border-hogwarts-300 dark:border-[#382f25]
          flex flex-col flex-shrink-0
          transition-all duration-150 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDragging ? 'select-none !transition-none' : ''}
        `}
      >
        <div
          style={{ width: `${currentWidth}px` }}
          className="h-full flex flex-col relative w-full overflow-hidden"
        >
          {/* Sidebar Top Controls Header */}
          <div className="p-3 border-b-2 border-hogwarts-200 dark:border-[#332b22] flex items-center justify-between gap-2 shrink-0 bg-[#f7f2e7] dark:bg-[#191512]">
            {!effectiveCollapsed ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-xl bg-tiffany-100 dark:bg-tiffany-950 text-tiffany-950 dark:text-tiffany-200 border border-tiffany-300 dark:border-tiffany-700 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-tiffany-700 dark:text-tiffany-300" />
                </div>
                <div className="truncate">
                  <span className="font-serif font-bold text-xs text-hogwarts-950 dark:text-white block truncate">
                    Menu Zona Healer
                  </span>
                  <span className="text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-medium block truncate">
                    5 Realm & 10 Quest
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <Compass className="w-5 h-5 text-tiffany-700 dark:text-tiffany-300" />
              </div>
            )}

            <div className="flex items-center gap-1 shrink-0">
              {/* Desktop Collapse / Expand Toggle */}
              <button
                type="button"
                onClick={handleToggleCollapse}
                title={effectiveCollapsed ? 'Perbesar Menu Samping' : 'Kecilkan Menu (Mode Icon)'}
                className="hidden md:flex p-1.5 rounded-xl text-hogwarts-700 dark:text-hogwarts-300 hover:text-hogwarts-950 dark:hover:text-white hover:bg-hogwarts-200 dark:hover:bg-[#28211b] transition active:scale-90 cursor-pointer"
              >
                {effectiveCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Tutup Menu"
                className="md:hidden p-1.5 rounded-xl text-hogwarts-700 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#28211b] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Body (Scrollable List of Realms & Sub-tabs) */}
          <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 divide-y divide-hogwarts-200/60 dark:divide-[#2e261f]">
            {realms.map((realm) => {
              const isRealmExpanded = expandedRealms[realm.id] !== false;
              const hasActiveChild = realm.subTabs.some(st => st.id === activeTab);

              return (
                <div key={realm.id} className="pt-2.5 first:pt-0 space-y-1">
                  {/* Realm Group Header */}
                  {!effectiveCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleRealmAccordion(realm.id)}
                      title={`Klik untuk buka/tutup zona ${realm.name}`}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded-xl text-left transition group cursor-pointer ${
                        hasActiveChild
                          ? 'text-tiffany-950 dark:text-tiffany-200'
                          : 'text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm shrink-0">{realm.icon}</span>
                        <span className="font-serif font-extrabold text-[11px] uppercase tracking-wider truncate">
                          {realm.name}
                        </span>
                      </div>
                      <span className="text-hogwarts-500 dark:text-hogwarts-500 group-hover:text-hogwarts-800 dark:group-hover:text-hogwarts-300 transition-transform">
                        {isRealmExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>
                  ) : (
                    <div className="flex justify-center py-1">
                      <span className="text-sm select-none" title={realm.name}>
                        {realm.icon}
                      </span>
                    </div>
                  )}

                  {/* Sub-tabs List */}
                  {(isRealmExpanded || effectiveCollapsed) && (
                    <div className="space-y-1">
                      {realm.subTabs.map((subTab) => {
                        const isSelected = activeTab === subTab.id;

                        if (effectiveCollapsed) {
                          // Icon-only mode for collapsed view
                          return (
                            <button
                              key={subTab.id}
                              onClick={() => handleSelectTab(subTab.id)}
                              title={`${subTab.label} — ${subTab.desc}`}
                              className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-tiffany-200 dark:bg-tiffany-950 text-tiffany-950 dark:text-tiffany-200 border-2 border-tiffany-600 dark:border-tiffany-500 shadow-sm scale-105'
                                  : 'text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#251f19] border border-transparent hover:border-hogwarts-300 dark:hover:border-[#382f25]'
                              }`}
                            >
                              <span className="text-lg">{subTab.icon}</span>
                              {isSelected && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-tiffany-500 border border-white dark:border-[#161310]" />
                              )}
                            </button>
                          );
                        }

                        // Full expanded sub-tab card
                        return (
                          <button
                            key={subTab.id}
                            onClick={() => handleSelectTab(subTab.id)}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer select-none group ${
                              isSelected
                                ? 'bg-tiffany-200 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-100 border-2 border-tiffany-600 dark:border-tiffany-500 shadow-xs font-extrabold translate-x-0.5'
                                : 'text-hogwarts-900 dark:text-hogwarts-300 hover:text-hogwarts-950 dark:hover:text-white hover:bg-hogwarts-100 dark:hover:bg-[#251f19] border border-transparent font-medium hover:border-hogwarts-300 dark:hover:border-[#382f25]'
                            }`}
                          >
                            <span className="text-base shrink-0 p-1 rounded-lg bg-white/70 dark:bg-[#221c17] border border-hogwarts-300/60 dark:border-[#3a3026]">
                              {subTab.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs truncate font-bold">
                                  {subTab.label}
                                </span>
                                {isSelected && (
                                  <Sparkles className="w-3 h-3 text-tiffany-700 dark:text-tiffany-300 shrink-0" />
                                )}
                              </div>
                              {currentWidth >= 220 && (
                                <span className="text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-normal truncate block">
                                  {subTab.desc}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer of Sidebar: Quick status pill */}
          {!effectiveCollapsed && (
            <div className="p-3 border-t-2 border-hogwarts-200 dark:border-[#332b22] bg-[#f7f2e7] dark:bg-[#191512] shrink-0 text-center">
              <div className="text-[10px] font-bold text-hogwarts-600 dark:text-hogwarts-400 flex items-center justify-center gap-1.5 font-serif">
                <span>Tab Aktif:</span>
                <span className="text-tiffany-800 dark:text-tiffany-300 font-extrabold truncate">
                  {realms.flatMap(r => r.subTabs).find(s => s.id === activeTab)?.label || 'Markas'}
                </span>
              </div>
            </div>
          )}

          {/* Vertical Draggable Resize Handle (Right Border) */}
          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClickHandle}
            title="Tarik ke kiri/kanan untuk atur lebar menu (Double click untuk reset default)"
            className={`
              hidden md:flex items-center justify-center
              absolute top-0 right-0 w-2 h-full
              cursor-col-resize select-none
              hover:bg-tiffany-500/40 active:bg-tiffany-500
              transition-colors group
              ${isDragging ? 'bg-tiffany-500' : 'bg-transparent'}
            `}
          >
            <div className="w-0.5 h-8 rounded-full bg-hogwarts-400 dark:bg-hogwarts-600 group-hover:bg-tiffany-600 group-hover:h-12 transition-all" />
          </div>
        </div>
      </aside>
    </>
  );
};
