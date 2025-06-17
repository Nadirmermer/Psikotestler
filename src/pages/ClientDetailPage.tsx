import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Save, X, User, FileText, BrainCircuit, Clock, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Tipleri ayrı tanımlamak daha temiz bir kod sağlar
type Client = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
};

type SessionNote = {
  id: string;
  note: string;
  session_date: string;
  created_at: string;
  updated_at: string;
};

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [deletingNote, setDeletingNote] = useState<SessionNote | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [scidSessions, setScidSessions] = useState<any[]>([]);
  const [clientForm, setClientForm] = useState<Client | null>(null);

  // URL parametrelerinden tab değerini al
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get('tab') || 'notes';

  const fetchClientAndNotes = async () => {
    if (!user || !id) return;
    setLoading(true);

    const clientPromise = supabase.from('clients').select('*').eq('id', id).single();
    const notesPromise = supabase.from('session_notes').select('*').eq('client_id', id).order('session_date', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
    const scidPromise = supabase.from('scid_sessions').select('*').eq('client_id', id).order('created_at', { ascending: false });
    
    const [clientResult, notesResult, scidResult] = await Promise.all([clientPromise, notesPromise, scidPromise]);

    if (clientResult.error) {
      toast.error('Danışan bilgileri yüklenirken hata oluştu');
      setClient(null);
    } else {
      setClient(clientResult.data);
      setClientForm(clientResult.data);
    }
    
    if (notesResult.error) {
      toast.error('Seans notları yüklenirken hata oluştu');
    } else {
      setNotes(notesResult.data);
    }

    if (scidResult.error) {
      console.error('SCID seansları yüklenirken hata:', scidResult.error);
    } else {
      setScidSessions(scidResult.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClientAndNotes();
  }, [user, id]);
  
  const handleSaveNote = async () => {
    if (!user || !id || !newNote.trim()) return;
    setIsSaving(true);
    const { error } = await supabase.from('session_notes').insert([{ client_id: id, user_id: user.id, note: newNote.trim(), session_date: new Date().toISOString().split('T')[0] }]);
    if (error) toast.error('Not kaydedilirken hata oluştu');
    else {
      toast.success('Not kaydedildi');
      setNewNote('');
      fetchClientAndNotes();
    }
    setIsSaving(false);
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNoteText.trim()) return;
    setIsSaving(true);
    const { error } = await supabase.from('session_notes').update({ note: editingNoteText.trim(), updated_at: new Date().toISOString() }).eq('id', editingNote.id);
    if (error) toast.error('Not güncellenirken hata oluştu');
    else {
      toast.success('Not güncellendi');
      setEditingNote(null);
      fetchClientAndNotes();
    }
    setIsSaving(false);
  };

  const confirmDeleteNote = async () => {
    if (!deletingNote) return;
    const { error } = await supabase.from('session_notes').delete().eq('id', deletingNote.id);
    if (error) toast.error('Not silinirken hata oluştu');
    else {
      toast.success('Not silindi');
      fetchClientAndNotes();
    }
    setDeletingNote(null);
  };
  
  const handleClientInfoUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientForm) return;
    setIsSaving(true);
    const { error } = await supabase.from('clients').update({ full_name: clientForm.full_name, email: clientForm.email, phone: clientForm.phone }).eq('id', clientForm.id);
    if (error) toast.error("Danışan bilgileri güncellenemedi.");
    else {
       toast.success("Danışan bilgileri güncellendi.");
       fetchClientAndNotes();
    }
    setIsSaving(false);
  };

  const startNewScidCvSession = async () => {
    if (!user || !id) return;
    
    const { data, error } = await supabase
      .from('scid_sessions')
      .insert({
        client_id: id,
        user_id: user.id,
        test_type: 'scid-5-cv',
        status: 'in-progress'
      })
      .select('id')
      .single();

    if (error) {
      toast.error('Yeni SCID-5-CV seansı başlatılırken bir hata oluştu.');
      console.error(error);
    } else {
      navigate(`/clients/${id}/scid/cv/${data.id}`);
    }
  };

  const viewTestReport = async (sessionId: string) => {
    navigate(`/clients/${id}/scid/cv/${sessionId}/report`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">Danışan bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 flex items-center justify-center p-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Danışan Bulunamadı</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Danışan bulunamadı veya bu danışana erişim izniniz yok.</p>
          <Link 
            to="/clients" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Danışanlara Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          <Link 
            to="/clients" 
            className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">Danışan Listesine Geri Dön</span>
      </Link>
          
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">
                {client.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">{client.full_name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Danışan Profili</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-2">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 dark:bg-gray-700/50 rounded-2xl p-1">
              <TabsTrigger 
                value="notes" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="hidden sm:inline">Seans Notları</span>
                <span className="sm:hidden">Notlar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="scid" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BrainCircuit className="h-5 w-5" />
                <span className="hidden sm:inline">Testler</span>
                <span className="sm:hidden">Testler</span>
              </TabsTrigger>
              <TabsTrigger 
                value="test-history" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Clock className="h-5 w-5" />
                <span className="hidden sm:inline">Test Geçmişi</span>
                <span className="sm:hidden">Geçmiş</span>
              </TabsTrigger>
              <TabsTrigger 
                value="info" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Bilgiler</span>
                <span className="sm:hidden">Bilgi</span>
              </TabsTrigger>
        </TabsList>
          </div>

          <TabsContent value="notes" className="mt-8 space-y-8">
            {/* New Note Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Yeni Seans Notu</h2>
              </div>
              
              <textarea 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)} 
                placeholder="Seans notunuzu buraya yazın... (Markdown desteklenir)" 
                className="w-full h-40 p-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              />
              
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSaveNote} 
                  disabled={isSaving || !newNote.trim()} 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSaving ? 'Kaydediliyor...' : 'Notu Kaydet'}</span>
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Geçmiş Notlar ({notes.length})
                </h2>
              </div>
              
              {notes.length > 0 ? (
                <div className="space-y-6">
                  {notes.map(note => (
                    <div key={note.id} className="bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-gray-700/50 dark:to-gray-800/30 rounded-2xl border border-gray-200/30 dark:border-gray-600/30 p-6 hover:shadow-xl transition-all duration-300">
                      {editingNote?.id === note.id ? (
          <div className="space-y-4">
                          <textarea 
                            value={editingNoteText} 
                            onChange={(e) => setEditingNoteText(e.target.value)} 
                            className="w-full h-48 p-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-800 dark:text-white resize-none" 
                          />
                          <div className="flex justify-end space-x-3">
                            <button 
                              onClick={() => setEditingNote(null)} 
                              className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl font-medium transition-all duration-300"
                            >
                              İptal
                            </button>
                            <button 
                              onClick={handleUpdateNote} 
                              disabled={isSaving} 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                            >
                              <Save className="h-4 w-4" />
                              <span>{isSaving ? 'Güncelleniyor...' : 'Güncelle'}</span>
                            </button>
                     </div>
                   </div>
                ) : (
                  <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Clock className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  {new Date(note.session_date).toLocaleDateString('tr-TR')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(note.created_at).toLocaleString('tr-TR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => { setEditingNote(note); setEditingNoteText(note.note); }} 
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300" 
                                title="Düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => setDeletingNote(note)} 
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300" 
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{note.note}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Henüz not yok</h3>
                  <p className="text-gray-600 dark:text-gray-300">İlk seans notunuzu yukarıdaki alandan ekleyebilirsiniz.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Test Geçmişi Tab */}
          <TabsContent value="test-history" className="mt-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Test Geçmişi</h2>
              </div>
              
              {scidSessions.length > 0 ? (
                <div className="space-y-4">
                  {scidSessions.map((session) => (
                    <div key={session.id} className="bg-gradient-to-br from-gray-50/50 to-white/30 dark:from-gray-700/30 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-600/30 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BrainCircuit className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              SCID-5-CV Görüşmesi
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(session.created_at).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'completed' 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                              : session.status === 'in_progress'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                          }`}>
                            {session.status === 'completed' ? 'Tamamlandı' : 
                             session.status === 'in_progress' ? 'Devam Ediyor' : 'Başlatılmadı'}
                          </span>
                          <button
                            onClick={() => viewTestReport(session.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            Raporu Görüntüle
                          </button>
                        </div>
                      </div>
                      
                      {/* Test Özeti */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Seçilen Modüller</div>
                          <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            {session.selected_modules ? JSON.parse(session.selected_modules).length : 0}
                          </div>
                        </div>
                        <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Yanıtlanan Sorular</div>
                          <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            {session.answer_count || 0}
                          </div>
                        </div>
                        <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saptanan Tanılar</div>
                          <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            {session.diagnosis_count || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Henüz Test Yapılmamış
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Bu danışan için henüz SCID-5-CV testi yapılmamış.
                  </p>
                  </div>
                )}
            </div>
          </TabsContent>

          <TabsContent value="scid" className="mt-8 space-y-8">
            {/* Yeni Test Başlatma */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Testler</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BrainCircuit className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">SCID-5-CV</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Klinik Versiyon</p>
                    </div>
          </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                    DSM-5 tanı kriterlerine dayalı yapılandırılmış klinik görüşme formu.
            </p>
               <button 
                 onClick={startNewScidCvSession}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
               >
                    Yeni Test Başlat
               </button>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-700/50 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-600/30 opacity-50">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                      <BrainCircuit className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Diğer Testler</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Yakında...</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Gelecek güncellemelerde daha fazla test seçeneği eklenecek.
                  </p>
                  <button 
                    disabled
                    className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-3 px-6 rounded-2xl font-medium cursor-not-allowed"
                  >
                    Yakında Gelecek
               </button>
            </div>
              </div>
            </div>


          </TabsContent>

          <TabsContent value="info" className="mt-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Danışan Bilgileri</h2>
              </div>
              
              {clientForm && (
                <form onSubmit={handleClientInfoUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-800 dark:text-white"
                      value={clientForm.full_name}
                      onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-800 dark:text-white"
                      value={clientForm.email || ''}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-gray-800 dark:text-white"
                      value={clientForm.phone || ''}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      placeholder="0555 123 45 67"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>{isSaving ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}</span>
                    </button>
                </div>
              </form>
             )}
           </div>
        </TabsContent>
      </Tabs>

        {/* Delete Note Dialog */}
        <AlertDialog open={!!deletingNote} onOpenChange={() => setDeletingNote(null)}>
          <AlertDialogContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50">
          <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                Notu Sil
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                Bu seans notunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter className="space-x-4">
              <AlertDialogCancel className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-200 border-0 rounded-2xl px-6 py-3">
                İptal
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteNote}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl"
              >
                Sil
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </div>
  );
};
