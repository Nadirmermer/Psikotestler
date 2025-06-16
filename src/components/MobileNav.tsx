import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Anasayfa', href: '/', icon: Home },
    { name: 'Danışanlar', href: '/clients', icon: Users },
    { name: 'Ayarlar', href: '/settings', icon: Settings },
  ];

  const getActiveIndex = () => {
    const activeIndex = navigation.findIndex(item => 
      location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
    );
    return activeIndex >= 0 ? activeIndex : 0;
  };

  const activeIndex = getActiveIndex();

  // Her tab için hassas pozisyon hesaplama
  const getIndicatorStyle = () => {
    const tabWidth = 100 / navigation.length; // Her tab'ın yüzdesi
    const padding = 0.5; // Her iki taraftan padding
    
    return {
      left: `${(activeIndex * tabWidth) + padding}%`,
      width: `${tabWidth - (padding * 2)}%`
    };
  };

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-black/10 dark:shadow-black/30 p-2">
        
        {/* Sliding Background Indicator */}
        <div 
          className="absolute top-2 bottom-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg transition-all duration-200 ease-out"
          style={getIndicatorStyle()}
        />
        
        {/* Navigation Items */}
        <div className="relative flex items-center">
          {navigation.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 ease-out group flex-1 ${
                  isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {/* Icon */}
                <div className={`transition-all duration-200 ease-out ${
                  isActive 
                    ? 'transform scale-110 mb-1' 
                    : 'transform scale-100 group-hover:scale-110 group-active:scale-95'
                }`}>
                  <item.icon className={`h-6 w-6 transition-all duration-150 ${
                    isActive 
                      ? 'drop-shadow-lg' 
                      : 'group-hover:text-blue-500 dark:group-hover:text-blue-400'
                  }`} />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium transition-all duration-200 ease-out ${
                  isActive 
                    ? 'opacity-100 transform translate-y-0 drop-shadow-sm' 
                    : 'opacity-70 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                }`}>
                  {item.name}
                </span>
                
                {/* Ripple Effect on Touch */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-2xl transform scale-0 group-active:scale-100 transition-transform duration-150 ease-out ${
                    isActive ? 'opacity-0' : ''
                  }`} />
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Floating Dots Indicator */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {navigation.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ease-out ${
                index === activeIndex
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-125 shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 scale-100'
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
