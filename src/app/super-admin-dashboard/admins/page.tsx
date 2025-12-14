'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Shield, UserCog } from 'lucide-react'
import AddAdminModal from './addAdminModal'
import EditAdminModal from './editAdminModal'
import { logger } from '@/lib/logger'

interface Admin {
  id: string
  user_id: string | null
  name: string
  email: string
  role: 'admin' | 'super_admin'
  created_at: string
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchAdmins()
  }, [])

  const checkAuthAndFetchAdmins = async () => {
    try {
      // Verify user is super admin
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) {
        router.push('/login')
        return
      }

      const meData = await meRes.json()
      if (meData.role !== 'super_admin') {
        router.push('/dashboard')
        return
      }

      fetchAdmins()
    } catch (error) {
      logger.error('Auth check error', { error })
      router.push('/login')
    }
  }

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admins')
      if (res.ok) {
        const data = await res.json()
        setAdmins(data.admins || [])
      }
    } catch (error) {
      logger.error('Error fetching admins', { error })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchAdmins()
      } else {
        alert('Failed to delete admin')
      }
    } catch (error) {
      logger.error('Error deleting admin', { error })
      alert('Error deleting admin')
    }
  }

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a0ca3]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#3a0ca3] text-white px-4 py-2 rounded-lg hover:bg-[#1d0555] transition"
        >
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search admins by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {admin.role === 'super_admin' ? (
                        <Shield size={16} className="text-purple-600" />
                      ) : (
                        <UserCog size={16} className="text-blue-600" />
                      )}
                      <span className="font-medium text-gray-900">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.user_id ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending Setup
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingAdmin(admin)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchAdmins()
          }}
        />
      )}

      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSuccess={() => {
            setEditingAdmin(null)
            fetchAdmins()
          }}
        />
      )}
    </div>
  )
}
