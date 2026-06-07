import { Rocket, Trophy, BarChart2, FileText, Settings, Sparkles, Sun, Moon, Menu, X, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useIrisUser } from '../hooks/useIrisUser';

export type Screen = 'activate' | 'ranking' | 'prospective' | 'reports' | 'monitoring' | 'profile';

interface SidebarProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; Icon: React.ElementType }[] = [
  { id: 'activate',    label: 'Activate',    Icon: Rocket   },
  { id: 'ranking',     label: 'Ranking',     Icon: Trophy   },
  { id: 'prospective', label: 'Prospective', Icon: BarChart2 },
  { id: 'reports',     label: 'Reports',     Icon: FileText  },
  { id: 'monitoring',  label: 'Monitoring',  Icon: Monitor   },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { irisUser } = useIrisUser();

  const avatarSrc = irisUser?.primary_photo ?? 'https://ui-avatars.com/api/?name=IRIS&background=c084fc&color=fff&size=100';
  const displayName = irisUser?.hinge_name ? `@${irisUser.hinge_name}` : '@user';

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Sparkles size={20} className="text-primary" style={{ color: '#c084fc' }} />
        <span style={{ fontSize: 22, fontWeight: 700, color: '#c084fc', letterSpacing: '0.05em' }}>IRIS</span>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '0 16px 8px' }} />

      {/* Nav */}
      <nav className="flex-1 px-2 pt-2 space-y-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 rounded-btn transition-all duration-150"
              style={{
                padding: '10px 14px',
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? '#c084fc' : 'var(--text-secondary)',
                background: isActive ? 'rgba(192,132,252,0.09)' : 'transparent',
                borderLeft: isActive ? '3px solid #c084fc' : '3px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ height: 1, background: 'var(--border)', margin: '8px 16px' }} />

      {/* User section */}
      <div className="px-3 pb-4 flex items-center justify-between">
        <button
          onClick={() => { onNavigate('profile'); setMobileOpen(false); }}
          className="flex items-center gap-2"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
            borderRadius: 8, transition: 'background 0.15s',
            outline: active === 'profile' ? '1px solid rgba(192,132,252,0.4)' : 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,132,252,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <img
            src={avatarSrc}
            alt="avatar"
            className="rounded-full"
            style={{ width: 36, height: 36, objectFit: 'cover', border: `2px solid ${active === 'profile' ? '#c084fc' : 'var(--border)'}` }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: active === 'profile' ? '#c084fc' : 'var(--text)' }}>{displayName}</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="rounded-btn transition-colors"
            style={{ padding: 6, color: 'var(--text-secondary)', cursor: 'pointer', background: 'transparent', border: 'none' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="rounded-btn transition-colors"
            style={{ padding: 6, color: 'var(--text-secondary)', cursor: 'pointer', background: 'transparent', border: 'none' }}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0"
        style={{ width: 220, zIndex: 40 }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#c084fc' }}>IRIS</span>
        </div>
        <button onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <aside className="absolute left-0 top-0 bottom-0" style={{ width: 220, zIndex: 50 }} onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export type { Screen };
