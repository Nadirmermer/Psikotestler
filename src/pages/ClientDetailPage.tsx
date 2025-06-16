
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Save, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface Client {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  created_at: string
}

interface SessionNote {
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
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user && id) {
      fetchClientAndNotes()
    }
  }, [user, id])

  const fetchClientAndNotes = async () => {
    if (!user || !id) return

    // Fetch client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (clientError) {
      toast.error('Danışan bilgileri yüklenirken hata oluştu')
      console.error('Error fetching client:', clientError)
      setLoading(false)
      return
    }

    setClient(clientData)

    // Fetch session notes
    const { data: notesData, error: notesError } = await supabase
      .from('session_notes')
      .select('*')
      .eq('client_id', id)
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })

    if (notesError) {
      toast.error('Seans notları yüklenirken hata oluştu')
      console.error('Error fetching notes:', notesError)
    } else if (notesData) {
      setNotes(notesData)
    }

    setLoading(false)
  }

  const handleSaveNote = async () => {
    if (!user || !id || !newNote.trim()) return

    setSaving(true)
    const { error } = await supabase
      .from('session_notes')
      .insert([{
        client_id: id,
        user_id: user.id,
        note: newNote.trim(),
        session_date: new Date().toISOString().split('T')[0]
      }])

    if (error) {
      toast.error('Not kaydedilirken hata oluştu')
      console.error('Error saving note:', error)
    } else {
      toast.success('Not başarıyla kaydedildi')
      setNewNote('')
      fetchClientAndNotes()
    }
    setSaving(false)
  }

  const handleEditNote = (note: SessionNote) => {
    setEditingNote(note)
    setEditingNoteText(note.note)
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNoteText.trim()) return

    setSaving(true)
    const { error } = await supabase
      .from('session_notes')
      .update({
        note: editingNoteText.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', editingNote.id)

    if (error) {
      toast.error('Not güncellenirken hata oluştu')
      console.error('Error updating note:', error)
    } else {
      toast.success('Not başarıyla güncellendi')
      setEditingNote(null)
      setEditingNoteText('')
      fetchClientAndNotes()
    }
    setSaving(false)
  }

  const handleDeleteNote = async (note: SessionNote) => {
    if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      return
    }

    const { error } = await supabase
      .from('session_notes')
      .delete()
      .eq('id', note.id)

    if (error) {
      toast.error('Not silinirken hata oluştu')
      console.error('Error deleting note:', error)
    } else {
      toast.success('Not başarıyla silindi')
      fetchClientAndNotes()
    }
  }

  const cancelEdit = () => {
    setEditingNote(null)
    setEditingNoteText('')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Danışan bulunamadı</p>
        <Link
          to="/clients"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Danışanlara Dön
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/clients"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {client.full_name}
            </h1>
            <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400 mt-1">
              {client.email && <span>{client.email}</span>}
              {client.phone && <span>{client.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* New Note Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Seans Notu
        </h2>
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Seans notunuzu buraya yazın... (Markdown desteklenir)"
            className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={saving || !newNote.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Kaydediliyor...' : 'Notu Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Seans Notları ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Henüz seans notu eklenmemiş.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(note.session_date).toLocaleDateString('tr-TR')}</span>
                    {note.updated_at !== note.created_at && (
                      <span className="text-xs">(düzenlendi)</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {editingNote?.id === note.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </button>
                      <button
                        onClick={handleUpdateNote}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-2"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{note.note}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
