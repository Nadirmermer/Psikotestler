import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Save, X, User, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipleri ayrı tanımlamak daha temiz bir kod sağlar
type Client = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
}

type SessionNote = {
  id: string
  note: string
  session_date: string
  created_at: string
  updated_at: string
}

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [notes, setNotes] = useState<SessionNote[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null)
  const [editingNoteText, setEditingNoteText] = useState('')
  const [deletingNote, setDeletingNote] = useState<SessionNote | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchClientAndNotes = async () => {
    if (!user || !id) return;
    setLoading(true);

    const clientPromise = supabase.from('clients').select('*').eq('id', id).single();
    const notesPromise = supabase.from('session_notes').select('*').eq('client_id', id).order('session_date', { ascending: false });
    
    const [clientResult, notesResult] = await Promise.all([clientPromise, notesPromise]);

    if (clientResult.error) {
      toast.error('Danışan bilgileri yüklenirken hata oluştu');
      console.error('Error fetching client:', clientResult.error);
      setClient(null);
    } else {
      setClient(clientResult.data);
    }
    
    if (notesResult.error) {
      toast.error('Seans notları yüklenirken hata oluştu');
      console.error('Error fetching notes:', notesResult.error);
    } else {
      setNotes(notesResult.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchClientAndNotes();
  }, [user, id]);
  
  const handleSaveNote = async () => {
    if (!user || !id || !newNote.trim()) return
    setIsSaving(true);
    const { error } = await supabase.from('session_notes').insert([{ client_id: id, user_id: user.id, note: newNote.trim(), session_date: new Date().toISOString().split('T')[0] }])
    if (error) toast.error('Not kaydedilirken hata oluştu');
    else {
      toast.success('Not kaydedildi');
      setNewNote('');
      fetchClientAndNotes(); // Listeyi yenile
    }
    setIsSaving(false);
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNoteText.trim()) return
    setIsSaving(true);
    const { error } = await supabase.from('session_notes').update({ note: editingNoteText.trim(), updated_at: new Date().toISOString() }).eq('id', editingNote.id)
    if (error) toast.error('Not güncellenirken hata oluştu');
    else {
      toast.success('Not güncellendi');
      setEditingNote(null);
      fetchClientAndNotes();
    }
    setIsSaving(false);
  }

  const handleDeleteNote = async () => {
    if (!deletingNote) return;
    const { error } = await supabase.from('session_notes').delete().eq('id', deletingNote.id);
    if (error) toast.error('Not silinirken hata oluştu');
    else {
      toast.success('Not silindi');
      fetchClientAndNotes();
    }
    setDeletingNote(null);
  }
  
  const handleClientInfoUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client) return;
    setIsSaving(true);
    const { error } = await supabase.from('clients').update({ full_name: client.full_name, email: client.email, phone: client.phone }).eq('id', client.id);
    if (error) toast.error("Danışan bilgileri güncellenemedi.");
    else toast.success("Danışan bilgileri güncellendi.");
    setIsSaving(false);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Danışan bulunamadı veya bu danışana erişim izniniz yok.</p>
        <Link to="/clients" className="mt-4 inline-flex items-center text-blue-600 hover:underline"><ArrowLeft className="h-4 w-4 mr-2" /> Danışanlara Dön</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/clients" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Danışan Listesine Geri Dön
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{client.full_name}</h1>
      
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes"><FileText className="h-4 w-4 mr-2"/>Seans Notları</TabsTrigger>
          <TabsTrigger value="info"><User className="h-4 w-4 mr-2"/>Danışan Bilgileri</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
             <h2 className="text-xl font-semibold mb-4 flex items-center"><Plus className="h-5 w-5 mr-2" /> Yeni Seans Notu</h2>
             <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Seans notunuzu buraya yazın... (Markdown desteklenir)" className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 resize-none"/>
             <div className="flex justify-end mt-2"><button onClick={handleSaveNote} disabled={isSaving || !newNote.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"><Save className="h-4 w-4"/> {isSaving ? 'Kaydediliyor...' : 'Notu Kaydet'}</button></div>
          </div>
          <h2 className="text-xl font-semibold mb-4 flex items-center"><Calendar className="h-5 w-5 mr-2" /> Geçmiş Notlar ({notes.length})</h2>
          <div className="space-y-4">
            {notes.length > 0 ? notes.map(note => (
              <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {editingNote?.id === note.id ? (
                   <div>
                     <textarea value={editingNoteText} onChange={(e) => setEditingNoteText(e.target.value)} className="w-full h-40 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 resize-none" />
                     <div className="flex justify-end gap-2 mt-2">
                       <button onClick={() => setEditingNote(null)} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-md">İptal</button>
                       <button onClick={handleUpdateNote} disabled={isSaving} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"><Save className="h-4 w-4" /> {isSaving ? '...' : 'Güncelle'}</button>
                     </div>
                   </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(note.session_date).toLocaleDateString('tr-TR')}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditNote(note)} className="p-1 text-gray-400 hover:text-blue-600"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => setDeletingNote(note)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none"><ReactMarkdown>{note.note}</ReactMarkdown></div>
                  </div>
                )}
              </div>
            )) : <p className="text-gray-500 text-center py-8">Bu danışan için henüz not yok.</p>}
          </div>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <form onSubmit={handleClientInfoUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                <input value={client.full_name} onChange={e => setClient({...client, full_name: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input type="email" value={client.email || ''} onChange={e => setClient({...client, email: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input type="tel" value={client.phone || ''} onChange={e => setClient({...client, phone: e.target.value})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"><Save className="h-4 w-4"/> {isSaving ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}</button>
              </div>
            </form>
           </div>
        </TabsContent>
      </Tabs>

      {/* Delete Note Confirmation Dialog */}
       <AlertDialog open={deletingNote !== null} onOpenChange={() => setDeletingNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notu Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-red-600 hover:bg-red-700">Evet, Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
