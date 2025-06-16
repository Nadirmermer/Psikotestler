
import React, { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Users, Settings, LogOut, Sun, Moon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import toast from 'react-hot-toast'

export const AppLayout: React.FC = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null })

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error fetching profile:', error)
        } else if (data) {
          setProfile(data)
        }
      }
      fetchProfile()
    }
  }, [user])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Çıkış yapılırken hata oluştu')
    } else {
      toast.success('Başarıyla çıkış yapıldı')
    }
  }

  const navigation = [
    { name: 'Anasayfa', href: '/', icon: Home },
    { name: 'Danışanlar', href: '/clients', icon: Users },
    { name: 'Ayarlar', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PsikoTest</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Danışan Yönetimi</p>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="px-6 py-3 mt-6">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="mr-3 h-5 w-5" />
                Karanlık Tema
              </>
            ) : (
              <>
                <Sun className="mr-3 h-5 w-5" />
                Aydınlık Tema
              </>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.full_name || user?.email || 'Kullanıcı'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ruh Sağlığı Uzmanı</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
