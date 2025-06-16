
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Client {
  id: string
  full_name: string
  created_at: string
}

export const HomePage: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null })
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchRecentClients()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

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

  const fetchRecentClients = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('clients')
      .select('id, full_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching clients:', error)
    } else if (data) {
      setRecentClients(data)
    }
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Hoş Geldiniz, {profile.full_name || 'Kullanıcı'}
        </h1>
        <p className="text-blue-100">
          Danışanlarınızı yönetin ve seans notlarınızı güvenle saklayın.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Hızlı Eylemler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/clients"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Yeni Danışan Ekle</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Danışan bilgilerini kaydedin</p>
            </div>
          </Link>
          
          <Link
            to="/clients"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Danışanları Görüntüle</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tüm danışanlarınızı listeleyin</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Son Eklenen Danışanlar
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : recentClients.length > 0 ? (
          <div className="space-y-3">
            {recentClients.map((client) => (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {client.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{client.full_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(client.created_at)} tarihinde eklendi
                    </p>
                  </div>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Henüz danışan eklenmemiş</p>
            <Link
              to="/clients"
              className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              İlk danışanınızı ek
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
