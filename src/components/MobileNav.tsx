import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils'; // shadcn/ui tarafından sağlanan yardımcı fonksiyon

// Navigasyon linklerimizi ve ikonlarımızı tanımlıyoruz
const navigation = [
  { name: 'Anasayfa', href: '/', icon: Home },
  { name: 'Danışanlar', href: '/clients', icon: Users },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export const MobileNav: React.FC = () => {
  const location = useLocation(); // Mevcut sayfanın URL'sini almak için

  return (
    // Bu menü sadece mobil cihazlarda (md breakpoint'inin altında) görünecek
    <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          // O anki sayfanın linki ile bu navigasyon elemanının linki eşleşiyor mu?
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              // Aktif olan linki farklı renkte göstermek için stil ayarlaması
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-colors',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
