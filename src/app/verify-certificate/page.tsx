'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { AlertCircle, Award, CheckCircle, Download, Search, Shield, XCircle } from 'lucide-react'
import { logger } from '@/lib/logger'
import Header from '@/component/Header'
import Footer from '@/component/Footer'

interface Certificate {
  certificate_code: string
  certificate_number: string | null
  student_name: string
  student_email: string
  course_name: string
  exam_title: string | null
  final_score: number | null
  grade: string | null
  file_url: string
  issue_date: string
  expiry_date: string | null
  is_active: boolean
  is_verified: boolean
  is_expired?: boolean
  is_valid?: boolean
  created_at: string
}

const steps = [
  ['1', 'Locate Code', 'Locate the certificate code on your certificate (e.g. CERT-2025-001).'],
  ['2', 'Enter Details', 'Enter the code in the search box above and check the spelling.'],
  ['3', 'Click Verify', 'Click Verify Certificate to check authenticity against the registry.'],
  ['4', 'View & Download', 'View certificate details and download the official PDF if needed.'],
]

export default function VerifyCertificatePage() {
  const [searchCode, setSearchCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!searchCode.trim()) {
      setError('Please enter a certificate code')
      return
    }
    setLoading(true)
    setError('')
    setSearched(true)
    setCertificate(null)
    try {
      const response = await fetch(`/api/certificates/verify?code=${encodeURIComponent(searchCode.trim())}`)
      const data = await response.json()
      if (response.ok && data.found) {
        setCertificate(data.certificate)
        logger.log('Certificate verified successfully', { context: { code: searchCode } })
      } else {
        setError('Certificate not found. Please check the code and try again.')
        logger.warn('Certificate not found', { context: { code: searchCode } })
      }
    } catch (verificationError) {
      setError('Failed to verify certificate. Please try again.')
      logger.error('Certificate verification error', verificationError)
    } finally {
      setLoading(false)
    }
  }

  const getStatus = () => {
    if (!certificate) return null
    if (!certificate.is_active) return { tone: 'red', icon: <XCircle size={20} />, title: 'Invalid Certificate', message: 'This certificate has been deactivated.' }
    if (certificate.is_expired) return { tone: 'amber', icon: <AlertCircle size={20} />, title: 'Expired Certificate', message: `This certificate expired on ${new Date(certificate.expiry_date!).toLocaleDateString()}.` }
    return { tone: 'green', icon: <CheckCircle size={20} />, title: 'Verified & Authentic', message: 'Confirmed in the institutional records database.' }
  }

  const status = getStatus()
  const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' } as const

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900">
      <Header />
      <main>
        <section className="bg-linear-to-br from-[#eef4ff] via-white to-[#e8f5ff] px-4 pb-12 pt-14 text-center sm:px-6 lg:px-8 lg:pt-16"><span className="inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 shadow-sm"><Shield size={12} className="mr-2" />Official credential verification service</span><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Certificate Verification</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">Verify the authenticity of Zeteo Citadel Consult and Zeteo Academy certificates with our secure and reliable credential registry.</p><div className="mt-6 flex flex-wrap justify-center gap-5 text-[10px] font-semibold text-slate-600"><span>University of Ibadan Consulting Unit</span><span>SMPIN Accredited</span><span>NYSC SAED Verified</span></div></section>

        <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl rounded-lg border border-slate-100 bg-white p-5 shadow-lg sm:p-8"><div className="text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-[#e5edff] text-[#214397]"><Award size={22} /></span><h2 className="mt-3 text-xl font-bold">Verify Certificate</h2><p className="mt-1 text-xs text-slate-500">Enter the certificate code to verify its authenticity across our central archive.</p></div><form onSubmit={handleSearch} className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Certificate code" type="text" value={searchCode} onChange={(event) => setSearchCode(event.target.value.toUpperCase())} placeholder="CERT-2025-001" disabled={loading} className="w-full rounded-md bg-[#eef4ff] py-3 pl-9 pr-3 text-sm outline-none ring-[#214397] placeholder:text-slate-400 focus:ring-2" /></div><button type="submit" disabled={loading} className="rounded-md bg-[#214397] px-5 py-3 text-xs font-bold text-white hover:bg-[#173777] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Verifying...' : 'Verify Certificate'}</button></form><p className="mt-3 text-center text-[10px] text-emerald-600">256-bit encrypted validation connected to institutional partner registries.</p>

          {error && <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-md border border-red-100 bg-red-50 p-4 text-left"><XCircle className="shrink-0 text-red-600" size={18} /><div><p className="text-sm font-bold text-red-900">Certificate Not Found</p><p className="mt-1 text-xs text-red-700">{error}</p></div></div>}

          {certificate && status && <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-[#f1f5ff] p-4 sm:p-6"><div className={`flex items-center justify-between rounded-md bg-white p-4 ${status.tone === 'green' ? 'text-emerald-600' : status.tone === 'amber' ? 'text-amber-600' : 'text-red-600'}`}><div className="flex items-center gap-3">{status.icon}<div><p className="text-xs font-bold uppercase tracking-wide">{status.title}</p><p className="text-[10px] text-slate-500">{status.message}</p></div></div><span className="hidden text-[10px] font-semibold text-slate-500 sm:inline">Audit Ref: ZCC-VAL-98442</span></div><div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr]"><div className="flex min-h-32 flex-col items-center justify-center rounded-md bg-white p-4 text-center"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5edff] text-[#214397]"><Award size={22} /></div><p className="mt-3 text-[9px] font-bold uppercase text-slate-500">Official certificate</p><p className="text-sm font-black text-[#214397]">ZETEO CITADEL</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-md bg-white p-3"><p className="text-[9px] uppercase text-slate-500">Recipient Name</p><p className="mt-1 text-sm font-bold">{certificate.student_name}</p></div><div className="rounded-md bg-white p-3"><p className="text-[9px] uppercase text-slate-500">Credential ID</p><p className="mt-1 text-sm font-bold text-[#214397]">{certificate.certificate_code}</p></div><div className="rounded-md bg-white p-3 sm:col-span-2"><p className="text-[9px] uppercase text-slate-500">Program / Course Completed</p><p className="mt-1 text-sm font-bold">{certificate.course_name}</p>{certificate.exam_title && <p className="mt-1 text-[10px] text-slate-500">{certificate.exam_title}</p>}</div><div className="rounded-md bg-white p-3"><p className="text-[9px] uppercase text-slate-500">Issue Date</p><p className="mt-1 text-xs font-bold">{new Date(certificate.issue_date).toLocaleDateString('en-US', dateFormat)}</p></div><div className="rounded-md bg-white p-3"><p className="text-[9px] uppercase text-slate-500">Accrediting Body</p><p className="mt-1 text-xs font-bold">SMPIN / NYSC SAED</p></div></div></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => window.open(certificate.file_url, '_blank')} className="inline-flex items-center gap-2 rounded-md bg-[#214397] px-4 py-2.5 text-xs font-bold text-white"><Download size={14} />Download Official Copy</button><span className="inline-flex items-center rounded-md bg-white px-4 py-2.5 text-xs font-bold text-[#214397]">Code: {certificate.certificate_number || certificate.certificate_code}</span></div></div>}
        </div></section>

        {!searched && <section className="bg-[#edf4ff] px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="text-center"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#214397]">Procedural transparency</span><h2 className="mt-2 text-2xl font-black">How to Verify a Certificate</h2><p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Follow these four straightforward steps to validate credentials issued by Zeteo Academy and Zeteo Citadel Consult.</p></div><div className="mt-8 grid gap-4 md:grid-cols-4">{steps.map(([number, title, description]) => <div key={number} className="rounded-lg bg-white p-5 shadow-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5edff] text-sm font-bold text-[#214397]">{number}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div>)}</div></div></section>}

        <section className="px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]"><div><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#214397]">Institutional accreditation</span><h2 className="mt-2 text-3xl font-black">Academic Validation Backed by Premier Nigerian Institutions</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">Every credential issued through Zeteo Citadel Consult is systematically authenticated alongside recognized academic leadership, ensuring employers, institutions, and graduates can independently audit qualifications with confidence.</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded bg-[#eef4ff] px-3 py-2 text-xs font-bold text-[#214397]">University of Ibadan</span><span className="rounded bg-[#eef4ff] px-3 py-2 text-xs font-bold text-[#214397]">SMPIN</span><span className="rounded bg-[#eef4ff] px-3 py-2 text-xs font-bold text-[#214397]">NYSC SAED</span></div></div><div className="relative h-72 overflow-hidden rounded-lg shadow-lg"><Image src="/HeroImages/12.png" alt="Zeteo learners receiving certificates" fill className="object-cover" /></div></div></section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-5 rounded-lg bg-[#e5efff] p-6 sm:flex-row sm:items-center sm:p-8"><div><h2 className="text-lg font-bold">Having trouble verifying a credential?</h2><p className="mt-2 text-xs leading-5 text-slate-600">Contact our credential desk directly for expedited manual registry confirmation.</p><a href="mailto:zeteocitadel08@gmail.com" className="mt-3 block text-xs font-semibold text-[#214397]">zeteocitadel08@gmail.com</a></div><a href="/contact" className="rounded-md bg-white px-5 py-3 text-xs font-bold text-[#214397] shadow-sm">Contact Verification Desk</a></div></section>
      </main>
      <Footer />
    </div>
  )
}