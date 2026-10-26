'use client';

import { useState, useEffect } from 'react';
import { inquiryService, InquiriesResponse } from '@/lib/api/inquiry-service';
import { Inquiry } from '@/lib/types';
import { toast } from 'react-hot-toast';
import {
  InboxStackIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ClockIcon,
  ScissorsIcon,
  CheckBadgeIcon,
  XMarkIcon,
  TrashIcon,
  ArrowPathIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    inProgress: 0,
  });

  // Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params: any = {
        pageSize: 50,
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (searchTerm) params.keyword = searchTerm;

      const response = await inquiryService.getInquiries(params);
      setInquiries(response.inquiries || []);
      if (response.counts) {
        setCounts(response.counts);
      }
    } catch (error: any) {
      console.error('Failed to fetch inquiries:', error);
      toast.error('Failed to load client requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleOpenModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || '');
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      await inquiryService.updateInquiry(inquiryId, { status: newStatus });
      toast.success(`Request status updated to ${newStatus}`);
      if (selectedInquiry && selectedInquiry._id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      }
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      setIsUpdating(true);
      await inquiryService.updateInquiry(selectedInquiry._id, { adminNotes });
      toast.success('Internal staff notes saved');
      setSelectedInquiry({ ...selectedInquiry, adminNotes });
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('Are you sure you wish to delete this client request?')) return;
    try {
      await inquiryService.deleteInquiry(inquiryId);
      toast.success('Client request removed');
      if (selectedInquiry?._id === inquiryId) {
        setSelectedInquiry(null);
      }
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30';
      case 'Contacted':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30';
      case 'Fitting Scheduled':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30';
      case 'Fulfilled':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.24em] uppercase text-primary mb-1">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>High-Priority Patron Requests</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Client Requests &amp; Bespoke Inquiries
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage bespoke commissions, atelier fitting appointments, and custom styling inquiries submitted by patrons.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:border-primary transition-all shadow-sm"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Total Patron Inquiries
          </span>
          <p className="font-serif text-3xl font-black text-foreground mt-2">{counts.total}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Lifetime received</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-amber-500/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">
            Pending Action
          </span>
          <p className="font-serif text-3xl font-black text-amber-500 mt-2">{counts.pending}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Awaiting response</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-purple-500/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-500 block">
            Fittings Scheduled
          </span>
          <p className="font-serif text-3xl font-black text-purple-500 mt-2">{counts.scheduled}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Confirmed salon slots</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-indigo-500/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">
            In Master Production
          </span>
          <p className="font-serif text-3xl font-black text-indigo-500 mt-2">{counts.inProgress}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Couture in progress</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Pending', 'Contacted', 'Fitting Scheduled', 'In Progress', 'Fulfilled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`}
            >
              {tab === 'all' ? 'All Requests' : tab}
            </button>
          ))}
        </div>

        {/* Type & Search Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Request Types</option>
            <option value="Bespoke Commission">Bespoke Commission</option>
            <option value="Atelier Fitting">Atelier Fitting</option>
            <option value="Custom Measurement">Custom Measurement</option>
            <option value="Order Inquiry">Order Inquiry</option>
            <option value="General">General Inquiry</option>
          </select>

          <form onSubmit={handleSearch} className="relative min-w-[220px]">
            <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patron, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </form>
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Loading Patron Requests...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-3xl border border-border p-8">
          <InboxStackIcon className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="font-serif text-lg font-bold text-foreground">No Inquiries Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            No client requests match your selected filters. New requests from the storefront will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="bg-card rounded-2xl border border-border/80 hover:border-primary/40 p-5 transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    {inquiry.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Received on {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-1">
                  <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span>{inquiry.name}</span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <EnvelopeIcon className="w-3.5 h-3.5 text-primary" />
                      <span>{inquiry.email}</span>
                    </a>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-foreground"
                    >
                      <PhoneIcon className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{inquiry.phone}</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs font-semibold text-foreground/90 line-clamp-1">
                  {inquiry.subject}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {inquiry.message}
                </p>

                {(inquiry.preferredDate || inquiry.preferredTime) && (
                  <div className="inline-flex items-center gap-3 pt-1 text-[11px] text-primary font-medium">
                    {inquiry.preferredDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        <span>Requested Date: {inquiry.preferredDate}</span>
                      </span>
                    )}
                    {inquiry.preferredTime && (
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>Time: {inquiry.preferredTime}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/60">
                <select
                  value={inquiry.status}
                  onChange={(e) => handleUpdateStatus(inquiry._id, e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Fitting Scheduled">Fitting Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Fulfilled">Fulfilled</option>
                  <option value="Archived">Archived</option>
                </select>

                <button
                  onClick={() => handleOpenModal(inquiry)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary/90 transition-all"
                >
                  Inspect &amp; Notes
                </button>

                <button
                  onClick={() => handleDelete(inquiry._id)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete Request"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect & Notes Side Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-primary/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(selectedInquiry.status)}`}>
                  {selectedInquiry.status}
                </span>
                <h2 className="font-serif text-xl font-bold text-foreground mt-2">
                  Patron Request Dossier
                </h2>
                <p className="text-xs text-muted-foreground">
                  Received on {new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Patron Info Card */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Patron Name</span>
                  <p className="font-serif text-base font-bold text-foreground mt-0.5">{selectedInquiry.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Request Category</span>
                  <p className="text-xs font-semibold text-primary mt-0.5">{selectedInquiry.type}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                  <p className="text-xs text-foreground mt-0.5">
                    <a href={`mailto:${selectedInquiry.email}`} className="hover:underline text-primary">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</span>
                  <p className="text-xs text-foreground mt-0.5">
                    <a href={`tel:${selectedInquiry.phone}`} className="hover:underline font-semibold">
                      {selectedInquiry.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Appointment Preferences */}
              {(selectedInquiry.preferredDate || selectedInquiry.preferredTime) && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-2">
                    Preferred Salon Appointment
                  </span>
                  <div className="flex items-center gap-6 text-xs text-foreground font-semibold">
                    <span>Date: {selectedInquiry.preferredDate || 'Flexible'}</span>
                    <span>Time Slot: {selectedInquiry.preferredTime || 'Anytime'}</span>
                  </div>
                </div>
              )}

              {/* Message Details */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Subject
                </span>
                <p className="text-sm font-semibold text-foreground">{selectedInquiry.subject}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-4 mb-1">
                  Client Message &amp; Commission Specifications
                </span>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Custom Measurements (if present) */}
              {selectedInquiry.measurements && Object.keys(selectedInquiry.measurements).length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-2">
                    Supplied Anatomical Measurements (Inches)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    {Object.entries(selectedInquiry.measurements).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-xl bg-card border border-border">
                        <span className="text-[9px] uppercase text-muted-foreground font-bold block">{key}</span>
                        <span className="font-serif font-black text-foreground mt-0.5 block">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff / Master Cutter Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Internal Master Cutter / Concierge Notes
                  </span>
                  <span className="text-[10px] text-muted-foreground">Private to admin team</span>
                </div>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Master cutter Vikram called client on 26 Oct. Sample swatch dispatched via courier. Fitting scheduled for Saturday 4pm..."
                  className="w-full rounded-2xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  className="mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary/90 transition-all"
                >
                  {isUpdating ? 'Saving Notes...' : 'Save Internal Notes'}
                </button>
              </div>
            </div>

            {/* Modal Footer Quick Status */}
            <div className="p-4 border-t border-border bg-card/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium mr-2">Set Status:</span>
                {['Pending', 'Contacted', 'Fitting Scheduled', 'Fulfilled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedInquiry._id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedInquiry.status === st
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
