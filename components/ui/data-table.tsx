'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Grid, List, Search, Plus, Edit, Trash2 } from 'lucide-react'

interface DataTableProps {
  data: any[]
  columns: { key: string; label: string }[]
  onAdd?: () => void
  onEdit?: (item: any, index: number) => void
  onDelete?: (index: number) => void
  title: string
}

export function DataTable({ data, columns, onAdd, onEdit, onDelete, title }: DataTableProps) {
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [search, setSearch] = useState('')

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  )

  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleOpenEdit = (item: any, index: number) => {
    setEditingItem({ ...item })
    setEditingIndex(index)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onEdit && editingItem !== null && editingIndex !== null) {
      onEdit(editingItem, editingIndex)
      setEditingItem(null)
      setEditingIndex(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'table' ? 'grid' : 'table')}
          >
            {view === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          {onAdd && (
            <Button onClick={onAdd} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900">
                {columns.map(col => (
                  <th key={col.key} className="border border-gray-200 px-4 py-2 text-left font-medium dark:border-slate-700">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium dark:border-slate-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-900/60">
                  {columns.map(col => (
                    <td key={col.key} className="border border-gray-200 px-4 py-2 dark:border-slate-700 max-w-xs truncate">
                      {Array.isArray(item[col.key]) ? item[col.key].join(', ') : String(item[col.key] ?? '-')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="border border-gray-200 px-4 py-2 dark:border-slate-700">
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(item, index)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700 dark:bg-slate-900/30">
              {columns.map(col => (
                <div key={col.key} className="mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">{col.label}:</span>
                  <span className="ml-2 text-sm">{Array.isArray(item[col.key]) ? item[col.key].join(', ') : String(item[col.key] ?? '-')}</span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="mt-3 flex gap-2 border-t pt-3 dark:border-slate-700">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(item, index)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(index)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Edit {title} Record</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {columns.map((col) => (
                <div key={col.key}>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">{col.label}</label>
                  {typeof editingItem[col.key] === 'boolean' ? (
                    <select
                      value={editingItem[col.key] ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, [col.key]: e.target.value === 'true' })
                      }
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="true">Active / Yes</option>
                      <option value="false">Inactive / No</option>
                    </select>
                  ) : String(editingItem[col.key] || '').length > 60 ? (
                    <textarea
                      rows={3}
                      value={String(editingItem[col.key] || '')}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, [col.key]: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <Input
                      value={String(editingItem[col.key] || '')}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, [col.key]: e.target.value })
                      }
                      className="border-zinc-800 bg-zinc-900 text-xs text-white"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <Button variant="outline" type="button" onClick={() => setEditingItem(null)} className="border-zinc-800 text-xs text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 text-xs text-white hover:bg-indigo-500">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}