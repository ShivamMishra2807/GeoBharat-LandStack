import React, { useEffect, useState } from 'react';
import { authApi } from '../../../api/authApi';
import { formatULPIN, formatDate, getStatusBadgeColor } from '../../../utils/formatters';
import { Inbox, CheckCircle2, Clock, ShieldCheck, Filter, RefreshCw, Eye } from 'lucide-react';
import Button from '../../../components/ui/Button';
import ApprovalWorkflow from './ApprovalWorkflow';

export const DepartmentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await authApi.getOfficialQueue();
      setQueue(res || []);
    } catch (err) {
      console.error('Failed to fetch official queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const isPendingStatus = (status) => {
    const s = String(status || '').toLowerCase();
    return s.includes('pending') || s.includes('submitted') || s.includes('queue') || s.includes('inspection') || s.includes('hearing') || s.includes('progress');
  };

  const isApprovedStatus = (status) => {
    const s = String(status || '').toLowerCase();
    return s.includes('approved') || s.includes('certified') || s.includes('completed') || s.includes('issued');
  };

  const pendingCount = queue.filter((item) => isPendingStatus(item.status)).length;
  const approvedCount = queue.filter((item) => isApprovedStatus(item.status)).length;
  const totalCount = queue.length;

  const filteredQueue = queue.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return isPendingStatus(item.status);
    if (activeFilter === 'approved') return isApprovedStatus(item.status);
    return item.department?.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Department Filters */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gov-navy/10 text-gov-navy flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Department Scrutiny Queue
            </h3>
            <p className="text-xs text-slate-500">
              Pending land mutation dockets, town planning permissions, and court disputes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Buttons with Count Badges */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
            {[
              { id: 'all', label: 'All', count: totalCount },
              { id: 'pending', label: 'Pending Scrutiny', count: pendingCount },
              { id: 'approved', label: 'Approved', count: approvedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === tab.id
                    ? 'bg-white text-gov-navy shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeFilter === tab.id
                      ? 'bg-gov-navy/10 text-gov-navy'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={fetchQueue}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-gov-navy hover:bg-slate-100 transition-colors"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Docket ID</th>
              <th className="px-4 py-3">Service & Department</th>
              <th className="px-4 py-3">ULPIN / Survey</th>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Loading department queue...
                </td>
              </tr>
            ) : filteredQueue.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No applications match the current filter.
                </td>
              </tr>
            ) : (
              filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gov-navy">
                    {item.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900 block">{item.service_type}</span>
                    <span className="text-[11px] text-slate-400">{item.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-slate-800 block">{formatULPIN(item.ulpin)}</span>
                    <span className="text-[11px] text-slate-500">S.No {item.survey_no}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {item.applicant_name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority?.includes('Urgent')
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs py-1 px-2.5"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      icon={Eye}
                    >
                      Scrutiny
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <ApprovalWorkflow
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onActionCompleted={fetchQueue}
        />
      )}
    </div>
  );
};

export default DepartmentQueue;
