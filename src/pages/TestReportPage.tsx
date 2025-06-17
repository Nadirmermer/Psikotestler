import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Calendar, 
  User, 
  BrainCircuit,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestSession {
  id: string;
  client_id: string;
  status: string;
  created_at: string;
  session_note: string;
  selected_modules: string;
  current_phase: string;
  client: {
    full_name: string;
  };
}

interface TestAnswer {
  id: string;
  question_code: string;
  answer: string;
  question_specific_note: string;
}

// Modül isimlerini döndüren yardımcı fonksiyon
const getModuleName = (moduleId: string): string => {
  const moduleNames: { [key: string]: string } = {
    'A': 'Depresif Bozukluklar',
    'B': 'Manik ve Hipomanik Epizodlar',
    'C': 'Psikotik Spektrum Bozuklukları',
    'D': 'Madde Kullanım Bozuklukları',
    'E': 'Anksiyete Bozuklukları',
    'F': 'Obsesif-Kompulsif Bozukluklar',
    'G': 'Travma ve Stresle İlişkili Bozukluklar',
    'H': 'Yeme Bozuklukları',
    'I': 'Uyku-Uyanıklık Bozuklukları',
    'J': 'Diğer Bozukluklar'
  };
  return moduleNames[moduleId] || `Modül ${moduleId}`;
};

export const TestReportPage: React.FC = () => {
  const { clientId, sessionId } = useParams<{ clientId: string; sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState<TestSession | null>(null);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && clientId && sessionId) {
      fetchTestData();
    }
  }, [user, clientId, sessionId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);

      // Session bilgilerini al
      const { data: sessionData, error: sessionError } = await supabase
        .from('scid_sessions')
        .select(`
          *,
          client:clients(full_name)
        `)
        .eq('id', sessionId)
        .eq('client_id', clientId)
        .single();

      if (sessionError) throw sessionError;

      // Cevapları al
      const { data: answersData, error: answersError } = await supabase
        .from('scid_answers')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      setSession(sessionData);
      setAnswers(answersData || []);
    } catch (error) {
      console.error('Test verilerini yükleme hatası:', error);
      toast.error('Test verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast('PDF indirme özelliği yakında eklenecek', {
      icon: 'ℹ️',
    });
  };

  const goBack = () => {
    navigate(`/clients/${clientId}?tab=test-history`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">Test raporu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 flex items-center justify-center p-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Test Bulunamadı</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Test raporu bulunamadı veya erişim izniniz yok.</p>
          <Button onClick={goBack} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  const positiveAnswers = answers.filter(answer => answer.answer === '+');
  const notesWithContent = answers.filter(answer => answer.question_specific_note?.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 print:bg-white">
      
      {/* Header */}
      <div className="print:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Test Geçmişine Dön</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Test Raporu
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.client.full_name} - {new Date(session.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>PDF İndir</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Yazdır</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-5xl mx-auto p-6 print:p-0">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 print:shadow-none print:rounded-none print:bg-white print:border-0">
          
          {/* Rapor Başlığı */}
          <header className="mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-700/50 print:border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BrainCircuit className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white print:text-black">
                    SCID-5-CV Test Raporu
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 print:text-gray-700">
                    Yapılandırılmış Klinik Görüşme - DSM-5 Klinik Versiyon
                  </p>
                </div>
              </div>
            </div>
            
            {/* Test Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">Danışan</p>
                  <p className="font-semibold text-gray-900 dark:text-white print:text-black">
                    {session.client.full_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">Test Tarihi</p>
                  <p className="font-semibold text-gray-900 dark:text-white print:text-black">
                    {new Date(session.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">Durum</p>
                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                    {session.status === 'completed' ? 'Tamamlandı' : 
                     session.status === 'in_progress' ? 'Devam Ediyor' : 'Duraklatıldı'}
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          {/* Test Özeti */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-500" />
              Test Özeti
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {answers.length}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Toplam Yanıtlanan Soru
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {positiveAnswers.length}
                    </div>
                    <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                      Pozitif Yanıt
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {notesWithContent.length}
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                      Notlu Soru
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Genel Değerlendirme */}
          {session.session_note && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-500" />
                Genel Değerlendirme
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {session.session_note}
                </p>
              </div>
            </section>
          )}

          {/* Seçilen Modüller */}
          {session.selected_modules && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
                Değerlendirilen Modüller
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {JSON.parse(session.selected_modules).map((moduleId: string, index: number) => (
                  <div key={moduleId} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-700/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        Modül {moduleId}
                      </div>
                      <div className="text-xs text-indigo-700 dark:text-indigo-300">
                        {getModuleName(moduleId)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Önemli Bulgular */}
          {positiveAnswers.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-emerald-500" />
                Önemli Bulgular
              </h2>
              
              <div className="space-y-4">
                {positiveAnswers.map((answer, index) => (
                  <div key={answer.id} className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                          Soru Kodu: {answer.question_code}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-300">
                          Yanıt: <span className="font-medium">Pozitif (+)</span>
                        </p>
                        {answer.question_specific_note && (
                          <div className="mt-3 p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>Not:</strong> {answer.question_specific_note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Detaylı Soru-Cevap Listesi */}
          {answers.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-500" />
                Detaylı Soru-Cevap Listesi
              </h2>
              
              {/* Notlu Sorular Özeti */}
              {notesWithContent.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/50">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Notlu Sorular ({notesWithContent.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {notesWithContent.map((answer) => (
                      <div key={answer.id} className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-amber-800 dark:text-amber-200">
                            {answer.question_code}
                          </span>
                          <Badge variant={answer.answer === '+' ? 'default' : 'secondary'} className="text-xs">
                            {answer.answer === '+' ? 'Pozitif' : answer.answer === '-' ? 'Negatif' : answer.answer}
                          </Badge>
                        </div>
                        <p className="text-sm text-amber-700 dark:text-amber-300 line-clamp-2">
                          {answer.question_specific_note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tüm Sorular */}
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div key={answer.id} className={`rounded-xl p-4 border ${
                    answer.answer === '+' 
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50'
                      : answer.question_specific_note?.trim()
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/50'
                      : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 border-gray-200/50 dark:border-gray-600/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          answer.answer === '+' 
                            ? 'bg-emerald-500' 
                            : answer.question_specific_note?.trim()
                            ? 'bg-amber-500'
                            : 'bg-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            Soru {answer.question_code}
                          </p>
                          {answer.question_specific_note && (
                            <div className="flex items-center space-x-1 mt-1">
                              <FileText className="h-3 w-3 text-amber-600" />
                              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                Not mevcut
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={answer.answer === '+' ? 'default' : 'secondary'}>
                        {answer.answer === '+' ? 'Pozitif (+)' : 
                         answer.answer === '-' ? 'Negatif (-)' : 
                         answer.answer || 'Yanıtsız'}
                      </Badge>
                    </div>
                    
                    {answer.question_specific_note && (
                      <div className="mt-3 p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          <strong className="text-amber-700 dark:text-amber-300">Not:</strong> {answer.question_specific_note}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 print:border-gray-300">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
              <p>Bu rapor {new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.</p>
              <p className="mt-1">SCID-5-CV - Yapılandırılmış Klinik Görüşme, DSM-5 Klinik Versiyon</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}; 