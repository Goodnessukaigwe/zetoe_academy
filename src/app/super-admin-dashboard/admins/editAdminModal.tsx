'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Admin {
  id: string
  user_id: string | null
  name: string
  email: string
  role: 'admin' | 'super_admin'
}

interface Props {
  admin: Admin
  onClose: () => void
  onSuccess: () => void
}

export default function EditAdminModal({ admin, onClose, onSuccess }: Props) {
  const [name, setName] = useState(admin.name)
  const [email, setEmail] = useState(admin.email)
  const [role, setRole] = useState(admin.role)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admins/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      })

      if (res.ok) {
        alert('Admin updated successfully!')
        onSuccess()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update admin')
      }
    } catch (error) {
      logger.error('Error updating admin', { error })
      alert('Error updating admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Admin</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'super_admin')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {!admin.user_id && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                This admin hasn't completed setup yet. Invitation link:
              </p>
              <code className="text-xs break-all bg-white px-2 py-1 rounded mt-1 block">
                {window.location.origin}/admin-invite?email={encodeURIComponent(admin.email)}
              </code>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#3a0ca3] text-white rounded-lg hover:bg-[#1d0555] transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
