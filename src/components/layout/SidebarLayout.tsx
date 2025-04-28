import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Cloud, Leaf, BarChart2, Settings, Users, 
  HelpCircle, LogOut, ChevronRight, ChevronLeft, Layers, Map
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: {
    text: string;
    color: 'primary' | 'success' | 'warning' | 'danger';
  };
  children?: {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

interface SidebarProps {
  children: React.ReactNode;
  activePath?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const navItems: SidebarItem[] = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: <Home size={20} />,
  },
  {
    name: 'Météo & Climat',
    href: '/weather',
    icon: <Cloud size={20} />,
  },
  {
    name: 'Fermes & Parcelles',
    href: '/farms',
    icon: <Map size={20} />,
    children: [
      {
        name: 'Toutes les fermes',
        href: '/farms',
      },
      {
        name: 'Cartographie',
        href: '/farms/map',
      },
      {
        name: 'Gestion des cultures',
        href: '/farms/crops',
      }
    ]
  },
  {
    name: 'Cultures',
    href: '/crops',
    icon: <Leaf size={20} />,
    badge: {
      text: 'Nouveau',
      color: 'primary'
    }
  },
  {
    name: 'Analyses & Rapports',
    href: '/analytics',
    icon: <BarChart2 size={20} />,
  },
  {
    name: 'Ressources',
    href: '/resources',
    icon: <Layers size={20} />,
  },
];

const bottomNavItems: SidebarItem[] = [
  {
    name: 'Paramètres',
    href: '/settings',
    icon: <Settings size={20} />,
  },
  {
    name: 'Support',
    href: '/support',
    icon: <HelpCircle size={20} />,
  },
];

const SidebarLayout: React.FC<SidebarProps> = ({ 
  children, 
  activePath = '/',
  userName = 'Utilisateur',
  userRole = 'Agriculteur',
  userAvatar,
  onLogout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Détecter si on est sur mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Gérer l'ouverture des sous-menus
  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  // Gérer la fermeture mobile lors du clic sur un lien
  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Initialiser le sous-menu actif basé sur le chemin
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children) {
        const activeChild = item.children.find(child => activePath.startsWith(child.href));
        if (activeChild) {
          setOpenSubmenu(item.name);
        }
      }
    });
  }, [activePath]);

  // Vérifier si un élément est actif
  const isActive = (href: string) => {
    if (href === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(href);
  };

  // Variants pour les animations
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' }
  };

  const mobileMenuVariants = {
    open: { 
      x: 0,
      transition: { type: 'tween', duration: 0.25 }
    },
    closed: { 
      x: '-100%',
      transition: { type: 'tween', duration: 0.25 }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Overlay pour mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-20 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar pour desktop */}
      <motion.aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-surface border-r border-border ${
          isCollapsed ? 'items-center' : 'items-stretch'
        }`}
        variants={sidebarVariants}
        initial={isCollapsed ? 'collapsed' : 'expanded'}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
      >
        {/* En-tête du sidebar */}
        <div className="p-4 flex justify-between items-center h-16 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center overflow-hidden">
              <span className="flex h-8 w-8 rounded-md bg-primary items-center justify-center text-white font-bold text-lg">
                A
              </span>
              <span className="ml-2 font-semibold text-text truncate">AgriTech</span>
            </div>
          )}
          {isCollapsed && (
            <span className="flex h-8 w-8 rounded-md bg-primary items-center justify-center text-white font-bold text-lg">
              A
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-2 text-text-secondary"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation principale */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md my-1 transition-colors ${
                    isActive(item.href) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-secondary hover:text-text hover:bg-surface-2'
                  }`}
                  onClick={() => {
                    handleNavClick();
                    if (item.children) {
                      handleSubmenuToggle(item.name);
                    }
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 flex-1 truncate">{item.name}</span>
                      {item.badge && (
                        <span className={`ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-${item.badge.color}/20 text-${item.badge.color}`}>
                          {item.badge.text}
                        </span>
                      )}
                      {item.children && (
                        <ChevronRight 
                          size={16} 
                          className={`ml-auto transition-transform ${openSubmenu === item.name ? 'rotate-90' : ''}`}
                        />
                      )}
                    </>
                  )}
                </a>
                
                {!isCollapsed && item.children && openSubmenu === item.name && (
                  <div className="mt-1 ml-5 pl-3 border-l border-border">
                    {item.children.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center px-3 py-2 text-sm rounded-md my-1 transition-colors ${
                          isActive(subItem.href) 
                            ? 'text-primary' 
                            : 'text-text-secondary hover:text-text'
                        }`}
                        onClick={handleNavClick}
                      >
                        {subItem.icon && <span className="flex-shrink-0 mr-3">{subItem.icon}</span>}
                        <span className="truncate">{subItem.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Navigation secondaire en bas */}
        <div className="py-2 px-2 border-t border-border">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md my-1 transition-colors ${
                  isActive(item.href) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:text-text hover:bg-surface-2'
                }`}
                onClick={handleNavClick}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* Profil utilisateur */}
        {!isCollapsed ? (
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="h-8 w-8 rounded-full" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-text truncate">{userName}</p>
                <p className="text-xs text-text-tertiary truncate">{userRole}</p>
              </div>
              <button 
                onClick={onLogout}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-2 text-text-secondary"
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-border">
            <button 
              onClick={onLogout}
              className="w-full p-2 flex items-center justify-center rounded-md hover:bg-surface-2 text-text-secondary"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}

        {/* ThemeToggle pour desktop */}
        {!isCollapsed && (
          <div className="p-2 border-t border-border">
            <ThemeToggle className="w-full" />
          </div>
        )}
      </motion.aside>

      {/* Sidebar pour mobile */}
      <motion.aside
        className="fixed top-0 left-0 bottom-0 w-64 z-30 lg:hidden bg-surface"
        variants={mobileMenuVariants}
        initial="closed"
        animate={isMobileOpen ? 'open' : 'closed'}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex justify-between items-center h-16 border-b border-border">
            <div className="flex items-center">
              <span className="flex h-8 w-8 rounded-md bg-primary items-center justify-center text-white font-bold text-lg">
                A
              </span>
              <span className="ml-2 font-semibold text-text">AgriTech</span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-2 text-text-secondary"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation principale mobile */}
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md my-1 transition-colors ${
                      isActive(item.href) 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-text-secondary hover:text-text hover:bg-surface-2'
                    }`}
                    onClick={() => {
                      if (item.children) {
                        handleSubmenuToggle(item.name);
                      } else {
                        handleNavClick();
                      }
                    }}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="ml-3 flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-${item.badge.color}/20 text-${item.badge.color}`}>
                        {item.badge.text}
                      </span>
                    )}
                    {item.children && (
                      <ChevronRight 
                        size={16} 
                        className={`ml-auto transition-transform ${openSubmenu === item.name ? 'rotate-90' : ''}`}
                      />
                    )}
                  </a>
                  
                  {item.children && openSubmenu === item.name && (
                    <div className="mt-1 ml-5 pl-3 border-l border-border">
                      {item.children.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-md my-1 transition-colors ${
                            isActive(subItem.href) 
                              ? 'text-primary' 
                              : 'text-text-secondary hover:text-text'
                          }`}
                          onClick={handleNavClick}
                        >
                          {subItem.icon && <span className="flex-shrink-0 mr-3">{subItem.icon}</span>}
                          <span>{subItem.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Navigation secondaire mobile */}
          <div className="py-2 px-2 border-t border-border">
            <nav className="space-y-1">
              {bottomNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md my-1 transition-colors ${
                    isActive(item.href) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-secondary hover:text-text hover:bg-surface-2'
                  }`}
                  onClick={handleNavClick}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Profil utilisateur mobile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="h-8 w-8 rounded-full" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-text">{userName}</p>
                <p className="text-xs text-text-tertiary">{userRole}</p>
              </div>
              <button 
                onClick={onLogout}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-2 text-text-secondary"
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* ThemeToggle pour mobile */}
          <div className="p-2 border-t border-border">
            <ThemeToggle className="w-full" />
          </div>
        </div>
      </motion.aside>

      {/* Contenu principal */}
      <div className={`flex-1 ${!isMobile ? 'lg:ml-16 xl:ml-64' : ''}`}>
        {/* Header mobile */}
        <header className="lg:hidden h-16 bg-surface border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-surface-2 text-text-secondary"
            >
              <Menu size={20} />
            </button>
            <div className="ml-3">
              <span className="flex h-8 w-8 rounded-md bg-primary items-center justify-center text-white font-bold text-lg">
                A
              </span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Contenu principal */}
        <main className="min-h-[calc(100vh-4rem)] lg:min-h-screen bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout; 