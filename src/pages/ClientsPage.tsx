import React, { useEffect, useState, useMemo } from 'react'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
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

interface Client {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  created_at: string
}

export const ClientsPage: React.FC = () => {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  })

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter(client =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  useEffect(() => {
    if (user) fetchClients();
  }, [user])

  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) toast.error('Danışanlar yüklenirken hata oluştu');
    else if (data) setClients(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.full_name.trim()) {
      toast.error("Danışan adı boş olamaz.");
      return;
    }

    const { error } = editingClient
      ? await supabase.from('clients').update({ ...formData, user_id: user.id }).eq('id', editingClient.id)
      : await supabase.from('clients').insert([{ ...formData, user_id: user.id }]);

    if (error) {
      toast.error('İşlem gerçekleştirilirken hata oluştu');
    } else {
      toast.success(editingClient ? 'Danışan güncellendi' : 'Danışan eklendi');
      fetchClients();
      closeModal();
    }
  }

  const confirmDelete = async () => {
    if (!deletingClient) return;

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', deletingClient.id);

    if (error) {
      toast.error('Danışan silinirken hata oluştu');
    } else {
      toast.success('Danışan başarıyla silindi');
      fetchClients();
    }
    setDeletingClient(null); // Onay penceresini kapat
  }

  const openModal = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({ full_name: client.full_name, email: client.email || '', phone: client.phone || '' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingClient(null)
    setFormData({ full_name: '', email: '', phone: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Danışanlar</h1>
        <div className="w-full md:w-auto flex gap-2">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Danışan ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Yeni Danışan</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-start"><div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
             </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                      {client.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(client)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Düzenle"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => setDeletingClient(client)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Sil"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{client.full_name}</h3>
                {client.email && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">{client.email}</p>}
                {client.phone && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{client.phone}</p>}
              </div>
              <Link to={`/clients/${client.id}`} className="mt-4 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Eye className="h-5 w-5" /> Notları Görüntüle
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && clients.length === 0 && (
         <div className="text-center py-16 text-gray-500 dark:text-gray-400">
           <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
           <h3 className="text-lg font-medium text-gray-900 dark:text-white">Henüz hiç danışan yok</h3>
           <p className="mt-1">İlk danışanınızı ekleyerek başlayın.</p>
         </div>
      )}

      {/* Add/Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingClient ? 'Danışanı Düzenle' : 'Yeni Danışan Ekle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad *</label>
                <input required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input type="tel" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">İptal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{editingClient ? 'Güncelle' : 'Ekle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingClient !== null} onOpenChange={() => setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingClient?.full_name}" adlı danışanı ve bu danışana ait tüm seans notlarını kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingClient(null)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Evet, Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
