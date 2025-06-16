import React from 'react';
import { ArrowLeft, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ScidTestHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  onExit?: () => void;
  backButtonText?: string;
}

export const ScidTestHeader: React.FC<ScidTestHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onExit,
  backButtonText = "Geri"
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Sol Taraf - Geri Butonu ve Başlık */}
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-4 py-2 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">{backButtonText}</span>
              </Button>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Taraf - Tema ve Çıkış Butonları */}
          <div className="flex items-center space-x-3">
            
            {/* Tema Değiştirme Butonu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* Çıkış Butonu */}
            {onExit && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl px-4 py-2 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Çıkış</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 dark:text-white">
                      Testten Çıkmak İstediğinizden Emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                      Kaydedilmemiş verileriniz kaybolabilir. Bu işlemi geri alamazsınız.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border-0 rounded-xl">
                      İptal
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onExit}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl"
                    >
                      Evet, Çık
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 