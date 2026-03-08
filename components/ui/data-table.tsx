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
                    <td key={col.key} className="border border-gray-200 px-4 py-2 dark:border-slate-700">
                      {String(item[col.key] || '-')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="border border-gray-200 px-4 py-2 dark:border-slate-700">
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item, index)}
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
                  <span className="ml-2">{String(item[col.key] || '-')}</span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="mt-3 flex gap-2 border-t pt-3 dark:border-slate-700">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item, index)}
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
    </div>
  )
}