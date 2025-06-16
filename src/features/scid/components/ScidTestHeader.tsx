import React, { useState } from 'react';
import { ArrowLeft, Sun, Moon, X, AlertTriangle } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

interface ScidTestHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  onExit?: () => void;
  showBackButton?: boolean;
  showExitButton?: boolean;
  backButtonText?: string;
}

export const ScidTestHeader: React.FC<ScidTestHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onExit,
  showBackButton = true,
  showExitButton = true,
  backButtonText = "Geri"
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExitClick = () => {
    if (onExit) {
      setShowExitDialog(true);
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    if (onExit) {
      onExit();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Sol Taraf - Geri Butonu */}
            <div className="flex items-center space-x-4">
              {showBackButton && onBack && (
                <button
                  onClick={onBack}
                  className="group flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="font-medium">{backButtonText}</span>
                </button>
              )}
            </div>

            {/* Orta - Başlık */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </div>
              )}
            </div>

            {/* Sağ Taraf - Tema ve Çıkış Butonları */}
            <div className="flex items-center space-x-2">
              
              {/* Tema Değiştirme Butonu */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
                title={theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <Sun className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                )}
              </button>

              {/* Çıkış Butonu */}
              {showExitButton && (
                <button
                  onClick={handleExitClick}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
                  title="Testi Sonlandır"
                >
                  <X className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Çıkış Onay Dialog'u */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span>Testi Sonlandır</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-4">
              Test oturumunu sonlandırmak istediğinizden emin misiniz? 
              <br />
              <strong>Kaydedilmemiş veriler kaybolabilir.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-4 mt-6">
            <AlertDialogCancel className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-200 border-0 rounded-2xl px-6 py-3">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmExit}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl"
            >
              Testi Sonlandır
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 