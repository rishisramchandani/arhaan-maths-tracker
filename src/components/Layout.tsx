import { NavLink, Outlet } from 'react-router-dom';
import { Swords, Skull, Timer, BarChart3, Map } from 'lucide-react';

const navItems = [
  { to: '/', icon: Swords, label: 'Campaign HQ' },
  { to: '/bosses', icon: Skull, label: 'Bosses' },
  { to: '/focus', icon: Timer, label: 'Focus Timer' },
  { to: '/stats', icon: BarChart3, label: 'War Room' },
  { to: '/tree', icon: Map, label: 'Skill Map' },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Desktop sidebar — fixed */}
      <aside className="hidden md:flex flex-col w-20 lg:w-56 bg-bg-dark border-r border-border h-screen fixed left-0 top-0 z-40">
        <div className="p-4 lg:p-6 border-b border-border">
          <h1 className="hidden lg:block font-display text-sm font-bold text-primary tracking-wider">
            THE MATHS<br />CAMPAIGN
          </h1>
          <div className="lg:hidden flex justify-center">
            <Swords className="w-6 h-6 text-primary" />
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 lg:px-6 py-3 transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10 border-r-2 border-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block text-sm font-heading font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block p-6 border-t border-border">
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">14-Day Sprint</p>
        </div>
      </aside>

      {/* Main content — uses CSS calc to constrain width to viewport minus sidebar */}
      <main className="app-main pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-border z-40 flex">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-heading">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
