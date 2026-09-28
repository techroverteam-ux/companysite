'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Filter, Download, Grid, List, Eye, Edit3, Trash2,
  Building2, Mail, Phone, Globe, MapPin, Calendar, DollarSign,
  TrendingUp, Users, CheckCircle2, Clock, FileText, ChevronRight,
  X, Check, AlertTriangle, ExternalLink, Tag, ShieldCheck, Briefcase,
  Layers, ArrowUpRight, ArrowDownRight, RefreshCw, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export interface ClientRecord {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  website: string
  logo: string
  country: string
  region: string
  industry: string
  accountStatus: 'Active' | 'Lead' | 'Onboarding' | 'Past Client'
  services: string[]
  projectsCompleted: number
  activeProjectsCount?: number
  totalValue: string
  numericValue?: number
  pipelineValue?: string
  description?: string
  billingAddress?: string
  slaTier?: 'Enterprise' | 'Gold' | 'Standard' | 'Custom'
  contractEnd?: string
  notes?: { id: string; date: string; author: string; text: string }[]
  associatedPortfolioIds?: string[]
  associatedCaseStudyIds?: string[]
}

interface ClientManagementProps {
  clients: ClientRecord[]
  portfolioData?: any[]
  caseStudiesData?: any[]
  servicesData?: any[]
  onSaveClients: (updatedClients: ClientRecord[]) => void
  onTriggerToast: (msg: string, type: 'success' | 'error') => void
}

const COUNTRY_FLAGS: Record<string, string> = {
  USA: '🇺🇸',
  'United States': '🇺🇸',
  India: '🇮🇳',
  UK: '🇬🇧',
  'United Kingdom': '🇬🇧',
  Canada: '🇨🇦',
  Singapore: '🇸🇬',
  Germany: '🇩🇪',
  Australia: '🇦🇺',
  UAE: '🇦🇪',
}

const COUNTRY_TIMEZONES: Record<string, string> = {
  USA: 'EST (UTC-5)',
  India: 'IST (UTC+5:30)',
  UK: 'GMT (UTC+0)',
  Canada: 'EST (UTC-5)',
  Singapore: 'SGT (UTC+8)',
  Germany: 'CET (UTC+1)',
  Australia: 'AEST (UTC+10)',
}

export function ClientManagement({
  clients: initialClients,
  portfolioData = [],
  caseStudiesData = [],
  servicesData = [],
  onSaveClients,
  onTriggerToast,
}: ClientManagementProps) {
  const [clients, setClients] = useState<ClientRecord[]>(() => {
    return initialClients.map((c) => ({
      ...c,
      contactPerson: c.contactPerson || 'Primary Contact',
      phone: c.phone || '+1 (555) 234-5678',
      website: c.website || 'https://example.com',
      accountStatus: c.accountStatus || 'Active',
      region: c.region || c.country || 'Global',
      billingAddress: c.billingAddress || '100 Innovation Way, Tech Park',
      slaTier: c.slaTier || 'Enterprise',
      contractEnd: c.contractEnd || '2026-12-31',
      activeProjectsCount: c.activeProjectsCount ?? 1,
      associatedPortfolioIds: c.associatedPortfolioIds || [],
      associatedCaseStudyIds: c.associatedCaseStudyIds || [],
      notes: c.notes || [
        {
          id: '1',
          date: '2026-09-10',
          author: 'Admin',
          text: 'Quarterly review completed. Client expressed interest in upgrading AI Agent workflows.',
        },
      ],
    }))
  })

  // Controls & Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedCountry, setSelectedCountry] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  // Selected Clients for Batch Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Active Modals & Slide-Overs
  const [selectedClientForView, setSelectedClientForView] = useState<ClientRecord | null>(null)
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)

  // Sync state upward when local state changes
  const updateClientsState = (newClients: ClientRecord[]) => {
    setClients(newClients)
    onSaveClients(newClients)
  }

  // Derive Filters List
  const industries = useMemo(() => {
    const list = Array.from(new Set(clients.map((c) => c.industry).filter(Boolean)))
    return ['All', ...list]
  }, [clients])

  const countries = useMemo(() => {
    const list = Array.from(new Set(clients.map((c) => c.country).filter(Boolean)))
    return ['All', ...list]
  }, [clients])

  // Real-time Debouncing & Filtering
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase())

      const matchIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry
      const matchStatus = selectedStatus === 'All' || c.accountStatus === selectedStatus
      const matchCountry = selectedCountry === 'All' || c.country === selectedCountry

      return matchSearch && matchIndustry && matchStatus && matchCountry
    })
  }, [clients, searchTerm, selectedIndustry, selectedStatus, selectedCountry])

  // Metrics Calculations
  const kpis = useMemo(() => {
    const total = clients.length
    const active = clients.filter((c) => c.accountStatus === 'Active').length
    const onboarding = clients.filter((c) => c.accountStatus === 'Onboarding').length
    
    // Parse revenue values cleanly
    const totalRev = clients.reduce((acc, c) => {
      const val = parseInt(c.totalValue.replace(/[^0-9]/g, '')) || 0
      return acc + val
    }, 0)

    const formattedRevenue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(totalRev)

    return {
      totalClients: total,
      activeClients: active,
      onboardingClients: onboarding,
      totalRevenue: formattedRevenue,
      pendingActions: onboarding + 2, // contracts & reviews
    }
  }, [clients])

  // Batch Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredClients.map((c) => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Delete Action
  const confirmDelete = () => {
    if (!deletingClientId) return
    const updated = clients.filter((c) => c.id !== deletingClientId)
    updateClientsState(updated)
    setDeletingClientId(null)
    onTriggerToast('Client successfully deleted.', 'success')
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Company Name', 'Contact Person', 'Email', 'Country', 'Industry', 'Status', 'Total Value']
    const rows = filteredClients.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.contactPerson}"`,
      c.email,
      c.country,
      c.industry,
      c.accountStatus,
      `"${c.totalValue}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `techrover_clients_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onTriggerToast('Client data exported as CSV', 'success')
  }

  // Status Badge Helper
  const getStatusBadge = (status: ClientRecord['accountStatus']) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25">Active</Badge>
      case 'Lead':
        return <Badge className="bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25">Lead</Badge>
      case 'Onboarding':
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25">Onboarding</Badge>
      case 'Past Client':
        return <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 hover:bg-slate-500/25">Past Client</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP-LEVEL KPIS & OVERVIEW                         */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Active Clients</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{kpis.activeClients}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" /> +12.5% MoM
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">{kpis.totalClients} total accounts in CRM</p>
          <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Revenue Under Management</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{kpis.totalRevenue}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> +18.4%
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Portfolio contract value</p>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Active Retainers & Projects</span>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-400">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">14</span>
            <span className="text-xs font-medium text-sky-400">Ongoing engagements</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Across AI, Web & ERP domains</p>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Pending Actions</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{kpis.pendingActions}</span>
            <span className="text-xs font-medium text-amber-400">Needs review</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">SLA renewals & Onboarding tasks</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. ENHANCED CONTROLS & FILTER BAR                    */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Realtime Search & Select Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search company, contact, email or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-zinc-800 bg-zinc-950/70 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="All">All Industries</option>
            {industries.filter((i) => i !== 'All').map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="All">All Countries</option>
            {countries.filter((c) => c !== 'All').map((cnt) => (
              <option key={cnt} value={cnt}>
                {cnt}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Past Client">Past Client</option>
          </select>
        </div>

        {/* Right: View Toggles & Actions */}
        <div className="flex items-center gap-2 border-t border-zinc-800/80 pt-3 lg:border-t-0 lg:pt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/60 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid className="h-3.5 w-3.5" /> Pipeline
            </button>
          </div>

          {/* Export CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-zinc-800 bg-zinc-950/60 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>

          {/* Add Client Trigger */}
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. CLIENT DATA TABLE OR KANBAN PIPELINE VIEW        */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3.5">Company & Contact</th>
                  <th className="px-4 py-3.5">Country / Region</th>
                  <th className="px-4 py-3.5">Industry & Services</th>
                  <th className="px-4 py-3.5">Account Status</th>
                  <th className="px-4 py-3.5 text-right">Contract Value</th>
                  <th className="px-4 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      No matching enterprise accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const isSelected = selectedIds.includes(client.id)
                    const flag = COUNTRY_FLAGS[client.country] || '🌐'
                    const tz = COUNTRY_TIMEZONES[client.country] || 'UTC'

                    return (
                      <tr
                        key={client.id}
                        className={`group transition-colors hover:bg-zinc-800/40 ${
                          isSelected ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(client.id)}
                            className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>

                        {/* Company & Contact */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-lg shadow-sm">
                              {client.logo || '🏢'}
                            </div>
                            <div>
                              <button
                                onClick={() => setSelectedClientForView(client)}
                                className="font-semibold text-white transition-colors hover:text-indigo-400 text-left"
                              >
                                {client.name}
                              </button>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                <span>{client.contactPerson}</span>
                                <span>•</span>
                                <a
                                  href={`mailto:${client.email}`}
                                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                                >
                                  {client.email}
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Country / Region */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{flag}</span>
                            <div>
                              <span className="block text-xs font-medium text-zinc-200">{client.country}</span>
                              <span className="block text-[10px] text-zinc-500">{tz}</span>
                            </div>
                          </div>
                        </td>

                        {/* Industry & Services */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-indigo-300 block">{client.industry}</span>
                            <div className="flex flex-wrap gap-1">
                              {(client.services || []).slice(0, 2).map((srv) => (
                                <span
                                  key={srv}
                                  className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 border border-zinc-700/50"
                                >
                                  {srv}
                                </span>
                              ))}
                              {(client.services || []).length > 2 && (
                                <span className="text-[10px] text-zinc-500">+{client.services.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(client.accountStatus)}
                        </td>

                        {/* Contract Value */}
                        <td className="px-4 py-4 text-right font-mono font-medium text-zinc-100 whitespace-nowrap">
                          {client.totalValue}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedClientForView(client)}
                              title="View Client 360"
                              className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingClient(client)}
                              title="Edit Client"
                              className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-indigo-400"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingClientId(client.id)}
                              title="Delete Client"
                              className="h-8 w-8 text-zinc-400 hover:bg-rose-950/40 hover:text-rose-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['Lead', 'Onboarding', 'Active', 'Past Client'] as const).map((statusGroup) => {
            const groupClients = filteredClients.filter((c) => c.accountStatus === statusGroup)
            return (
              <div
                key={statusGroup}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">{statusGroup}</span>
                    <Badge variant="outline" className="text-xs bg-zinc-950 border-zinc-700 text-zinc-400">
                      {groupClients.length}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {groupClients.map((c) => (
                    <div
                      key={c.id}
                      className="group rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{c.logo || '🏢'}</span>
                          <div>
                            <h4
                              onClick={() => setSelectedClientForView(c)}
                              className="font-semibold text-sm text-white hover:text-indigo-400 cursor-pointer"
                            >
                              {c.name}
                            </h4>
                            <p className="text-xs text-zinc-400">{c.contactPerson}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/60 pt-2">
                        <span>{COUNTRY_FLAGS[c.country] || ''} {c.country}</span>
                        <span className="font-mono text-zinc-200 font-semibold">{c.totalValue}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClientForView(c)}
                          className="h-7 text-[11px] text-zinc-300 hover:text-white"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingClient(c)}
                          className="h-7 text-[11px] text-indigo-400 hover:text-indigo-300"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                  {groupClients.length === 0 && (
                    <div className="p-6 text-center text-xs text-zinc-600 border border-dashed border-zinc-800/80 rounded-lg">
                      No {statusGroup.toLowerCase()} accounts
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. CLIENT 360° SLIDE-OVER SHEET                       */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedClientForView && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl border-l border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 p-6 bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-2xl shadow-inner">
                    {selectedClientForView.logo || '🏢'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedClientForView.name}</h2>
                      {getStatusBadge(selectedClientForView.accountStatus)}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Account ID: {selectedClientForView.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingClient(selectedClientForView)
                      setSelectedClientForView(null)
                    }}
                    className="border-zinc-700 bg-zinc-900 text-xs text-zinc-200 hover:bg-zinc-800"
                  >
                    <Edit3 className="mr-1.5 h-3.5 w-3.5 text-indigo-400" /> Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedClientForView(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Slide-over Content Tabs */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b border-zinc-800 bg-transparent p-0 rounded-none h-11 gap-6">
                    <TabsTrigger
                      value="overview"
                      className="border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent rounded-none px-0 font-medium text-xs text-zinc-400 data-[state=active]:text-white"
                    >
                      Overview & Contact
                    </TabsTrigger>
                    <TabsTrigger
                      value="services"
                      className="border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent rounded-none px-0 font-medium text-xs text-zinc-400 data-[state=active]:text-white"
                    >
                      Associated Projects
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent rounded-none px-0 font-medium text-xs text-zinc-400 data-[state=active]:text-white"
                    >
                      Activity & Notes
                    </TabsTrigger>
                    <TabsTrigger
                      value="contracts"
                      className="border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent rounded-none px-0 font-medium text-xs text-zinc-400 data-[state=active]:text-white"
                    >
                      Contracts & SLA
                    </TabsTrigger>
                  </TabsList>

                  {/* TAB 1: OVERVIEW */}
                  <TabsContent value="overview" className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase">Primary Contact</span>
                        <p className="text-sm font-medium text-zinc-100">{selectedClientForView.contactPerson}</p>
                        <a href={`mailto:${selectedClientForView.email}`} className="text-xs text-indigo-400 hover:underline block">
                          {selectedClientForView.email}
                        </a>
                        <p className="text-xs text-zinc-400">{selectedClientForView.phone}</p>
                      </div>

                      <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase">Location & Region</span>
                        <p className="text-sm font-medium text-zinc-100">
                          {COUNTRY_FLAGS[selectedClientForView.country] || ''} {selectedClientForView.country}
                        </p>
                        <p className="text-xs text-zinc-400">{COUNTRY_TIMEZONES[selectedClientForView.country] || 'Global'}</p>
                        <p className="text-xs text-zinc-500 truncate">{selectedClientForView.billingAddress}</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase block">Company Background</span>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {selectedClientForView.description || 'Enterprise client partnering with Techrover for strategic technological transformation and digital growth.'}
                      </p>
                      <div className="flex items-center gap-4 pt-2 text-xs text-zinc-400 border-t border-zinc-800">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-indigo-400" />
                          <a href={selectedClientForView.website} target="_blank" rel="noreferrer" className="hover:underline text-indigo-400">
                            {selectedClientForView.website}
                          </a>
                        </span>
                        <span>•</span>
                        <span>Industry: <strong>{selectedClientForView.industry}</strong></span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: ASSOCIATED SERVICES & PORTFOLIO */}
                  <TabsContent value="services" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Engaged Tech Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedClientForView.services || []).map((s) => (
                          <div key={s} className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300">
                            <Tag className="h-3.5 w-3.5" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Linked Case Studies & Portfolio Deliverables</h4>
                      <div className="space-y-2">
                        {caseStudiesData
                          .filter((cs) => cs.client?.toLowerCase() === selectedClientForView.name.toLowerCase() || cs.client === selectedClientForView.id)
                          .map((cs) => (
                            <div key={cs.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                              <div>
                                <p className="text-xs font-semibold text-white">{cs.title}</p>
                                <p className="text-[11px] text-zinc-400">Value: {cs.projectValue || selectedClientForView.totalValue} • {cs.duration}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-400">
                                View Case Study <ExternalLink className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        {caseStudiesData.filter((cs) => cs.client?.toLowerCase() === selectedClientForView.name.toLowerCase()).length === 0 && (
                          <p className="text-xs text-zinc-500 italic">No case study published yet for this account.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: ACTIVITY & NOTES */}
                  <TabsContent value="activity" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      {(selectedClientForView.notes || []).map((note) => (
                        <div key={note.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3.5 space-y-1">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-semibold text-zinc-200">{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-normal">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB 4: CONTRACTS & SLA */}
                  <TabsContent value="contracts" className="space-y-4 pt-4">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400">SLA Service Tier</span>
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40">{selectedClientForView.slaTier || 'Enterprise'}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                        <span>Contract Renewal Target</span>
                        <span className="font-mono text-zinc-100">{selectedClientForView.contractEnd || '2026-12-31'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                        <span>Lifetime Account Value</span>
                        <span className="font-mono text-emerald-400 font-bold">{selectedClientForView.totalValue}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* 5. EDIT CLIENT COMPREHENSIVE MODAL                   */}
      {/* ---------------------------------------------------- */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-400" /> Edit Enterprise Account
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingClient(null)} className="text-zinc-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const updatedList = clients.map((c) => (c.id === editingClient.id ? editingClient : c))
                updateClientsState(updatedList)
                setEditingClient(null)
                onTriggerToast('Client updated successfully!', 'success')
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Company Name</label>
                  <Input
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    className="border-zinc-800 bg-zinc-900 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Primary Contact</label>
                  <Input
                    value={editingClient.contactPerson}
                    onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                    className="border-zinc-800 bg-zinc-900 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="border-zinc-800 bg-zinc-900 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Phone Badge</label>
                  <Input
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="border-zinc-800 bg-zinc-900 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Country</label>
                  <Input
                    value={editingClient.country}
                    onChange={(e) => setEditingClient({ ...editingClient, country: e.target.value })}
                    className="border-zinc-800 bg-zinc-900 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Industry</label>
                  <Input
                    value={editingClient.industry}
                    onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                    className="border-zinc-800 bg-zinc-900 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Account Status</label>
                  <select
                    value={editingClient.accountStatus}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        accountStatus: e.target.value as ClientRecord['accountStatus'],
                      })
                    }
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Past Client">Past Client</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Contract Value</label>
                <Input
                  value={editingClient.totalValue}
                  onChange={(e) => setEditingClient({ ...editingClient, totalValue: e.target.value })}
                  className="border-zinc-800 bg-zinc-900 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <Button variant="outline" type="button" onClick={() => setEditingClient(null)} className="border-zinc-800 text-xs text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 text-xs text-white hover:bg-indigo-500">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. ADD CLIENT MODAL                                  */}
      {/* ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" /> Create Enterprise Account
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const newClient: ClientRecord = {
                  id: `client-${Date.now()}`,
                  name: formData.get('name') as string,
                  contactPerson: formData.get('contactPerson') as string,
                  email: formData.get('email') as string,
                  phone: (formData.get('phone') as string) || '+1 (555) 000-0000',
                  website: (formData.get('website') as string) || 'https://techrover.co.in',
                  logo: '🏢',
                  country: (formData.get('country') as string) || 'India',
                  region: (formData.get('country') as string) || 'India',
                  industry: (formData.get('industry') as string) || 'Technology',
                  accountStatus: (formData.get('accountStatus') as any) || 'Onboarding',
                  services: ['AI Development', 'Web Development'],
                  projectsCompleted: 1,
                  totalValue: (formData.get('totalValue') as string) || '₹25,00,000',
                }

                updateClientsState([newClient, ...clients])
                setIsAddModalOpen(false)
                onTriggerToast('New client created successfully!', 'success')
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Company Name</label>
                  <Input name="name" placeholder="e.g. Apex Dynamics Ltd" className="border-zinc-800 bg-zinc-900 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Primary Contact</label>
                  <Input name="contactPerson" placeholder="e.g. Sarah Jenkins" className="border-zinc-800 bg-zinc-900 text-xs text-white" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Email</label>
                  <Input name="email" type="email" placeholder="sarah@apexdynamics.com" className="border-zinc-800 bg-zinc-900 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Contract Value</label>
                  <Input name="totalValue" placeholder="₹45,00,000" className="border-zinc-800 bg-zinc-900 text-xs text-white" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Country</label>
                  <Input name="country" placeholder="USA" className="border-zinc-800 bg-zinc-900 text-xs text-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Industry</label>
                  <Input name="industry" placeholder="Fintech" className="border-zinc-800 bg-zinc-900 text-xs text-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Status</label>
                  <select
                    name="accountStatus"
                    defaultValue="Onboarding"
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Active">Active</option>
                    <option value="Past Client">Past Client</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)} className="border-zinc-800 text-xs text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 text-xs text-white hover:bg-indigo-500">
                  Create Account
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. DELETE CONFIRMATION DIALOG                        */}
      {/* ---------------------------------------------------- */}
      {deletingClientId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-rose-900/50 bg-zinc-950 p-6 shadow-2xl text-zinc-100 space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-500">
              <div className="rounded-full bg-rose-500/10 p-3">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Enterprise Account</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete this client record? All associated project relationships, activity logs, and contract data will be removed.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-900">
              <Button variant="outline" onClick={() => setDeletingClientId(null)} className="border-zinc-800 text-xs text-zinc-300">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-rose-600 text-xs text-white hover:bg-rose-700">
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
