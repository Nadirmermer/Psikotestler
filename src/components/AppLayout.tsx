import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings, LogOut, Sun, Moon, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';
import { MobileNav } from './MobileNav';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Çıkış yapılırken hata oluştu');
    } else {
      toast.success('Başarıyla çıkış yapıldı');
    }
    setShowLogoutDialog(false);
  };

  const navigation = [
    { name: 'Anasayfa', href: '/', icon: Home },
    { name: 'Danışanlar', href: '/clients', icon: Users },
    { name: 'Ayarlar', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 flex">
      
      {/* Sidebar - Desktop */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 hidden md:flex md:flex-col shadow-2xl transition-all duration-300 h-screen fixed left-0 top-0 z-40`}>
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-white" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-white" />
          )}
        </button>
        
        {/* Logo */}
        <div className={`${isCollapsed ? 'p-4' : 'p-8'} transition-all duration-300`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">PsikoTest</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Profesyonel Platform</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-6'} transition-all duration-300`}>
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-sm font-medium rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-800 dark:hover:text-white hover:shadow-lg'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-300">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* User Section */}
        <div className={`${isCollapsed ? 'p-2' : 'p-6'} border-t border-gray-200/50 dark:border-gray-700/50 transition-all duration-300`}>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center w-full ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-sm font-medium text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 mb-4 group`}
            title={isCollapsed ? (theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema') : undefined}
          >
            {theme === 'light' ? (
              <Moon className={`h-5 w-5 group-hover:scale-110 transition-transform duration-300 ${isCollapsed ? '' : 'mr-3'}`} />
            ) : (
              <Sun className={`h-5 w-5 group-hover:scale-110 transition-transform duration-300 ${isCollapsed ? '' : 'mr-3'}`} />
            )}
            {!isCollapsed && (
              <span className="transition-opacity duration-300">
                {theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
              </span>
            )}
          </button>
          
          {/* User Info */}
          <div className={`bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-gray-700/50 dark:to-gray-800/30 rounded-2xl border border-gray-200/30 dark:border-gray-600/30 ${isCollapsed ? 'p-2' : 'p-4'} transition-all duration-300`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} min-w-0 flex-1`}>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {(profile.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1 transition-opacity duration-300">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {profile.full_name || user?.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Aktif Kullanıcı
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group"
                  title="Çıkış Yap"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </button>
              )}
            </div>
            
            {/* Collapsed Logout Button */}
            {isCollapsed && (
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full mt-2 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group flex justify-center"
                title="Çıkış Yap"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <LogOut className="h-6 w-6 text-white" />
              </div>
              <span>Çıkış Yap</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-4">
              Hesabınızdan çıkış yapmak istediğinizden emin misiniz? Kaydedilmemiş değişiklikler kaybolabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-4 mt-6">
            <AlertDialogCancel className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-200 border-0 rounded-2xl px-6 py-3">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl"
            >
              Çıkış Yap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
