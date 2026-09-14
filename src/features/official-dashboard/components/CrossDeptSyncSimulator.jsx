import React, { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { formatULPIN, formatINR } from '../../../utils/formatters';
import { ArrowRight, CheckCircle2, Play, RefreshCw, Landmark, FileText, IndianRupee, Bell, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const CrossDeptSyncSimulator = ({ onSyncCompleted, selectedUlpin }) => {
  const [targetUlpin, setTargetUlpin] = useState('27250010045001');
  const [buyerName, setBuyerName] = useState('Vikramaditya Rao');
  const [deedNo, setDeedNo] = useState('PUN-HAV4-2024-9988');
  const [consideration, setConsideration] = useState('24500000');
  const [simulating, setSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    if (selectedUlpin) {
      setTargetUlpin(selectedUlpin);
    }
  }, [selectedUlpin]);

  const steps = [
    { id: 0, system: 'Sub-Registrar Office (SRO)', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { id: 1, system: 'Revenue Land Records (Bhoomi / RoR)', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { id: 2, system: 'Municipal Tax Department (ULB)', icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { id: 3, system: 'DigiLocker & Citizen SMS Gateway', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  ];

  const handleRunSimulation = async () => {
    setSimulating(true);
    setSyncResult(null);
    setActiveStep(0);

    // Step 1: SRO
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(1);

    // Step 2: Revenue
    await new Promise((r) => setTimeout(r, 700));
    setActiveStep(2);

    // Step 3: Tax
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(3);

    try {
      const res = await axiosClient.post('/workflows/sync-sale-deed', {
        ulpin: targetUlpin,
        new_owner: buyerName,
        deed_number: deedNo,
        consideration_inr: parseFloat(consideration),
      });
      setSyncResult(res);
      if (onSyncCompleted) onSyncCompleted();
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-slate-900 tracking-tight">
              Cross-Departmental Interoperability Simulator
            </span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Silo-Breaker Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Watch real-time automated data propagation across Registration, Revenue RoR, and Municipal Tax systems
          </p>
        </div>
      </div>

      {/* Simulator Control Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
            Parcel ULPIN:
          </label>
          <select
            value={targetUlpin}
            onChange={(e) => setTargetUlpin(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-xs focus:ring-1 focus:ring-gov-navy focus:outline-none"
          >
            <option value="27250010045001" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">27250010045001 (Wagholi)</option>
            <option value="27250010045002" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">27250010045002 (Wagholi C-2)</option>
            <option value="09030020114003" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">09030020114003 (Lucknow Khasra)</option>
            <option value="33010050082005" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">33010050082005 (Kanchipuram Patta)</option>
            <option value="27200040019007" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">27200040019007 (Bandra East Card)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
            New Transferee / Buyer:
          </label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg text-xs focus:ring-1 focus:ring-gov-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
            Deed Panjiyan No:
          </label>
          <input
            type="text"
            value={deedNo}
            onChange={(e) => setDeedNo(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-xs focus:ring-1 focus:ring-gov-navy focus:outline-none"
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="primary"
            size="md"
            className="w-full text-xs font-semibold py-2"
            onClick={handleRunSimulation}
            loading={simulating}
            icon={Play}
          >
            Execute Interoperable Sync
          </Button>
        </div>
      </div>

      {/* Live Animated Event Bus Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
        {steps.map((stg) => {
          const Icon = stg.icon;
          const isDone = activeStep >= stg.id;
          const isCurrent = activeStep === stg.id && simulating;

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? `${stg.bg} shadow-xs`
                  : 'bg-white border-slate-200 opacity-60'
              } ${isCurrent ? 'ring-2 ring-gov-navy animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-white shadow-xs ${stg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                    Step 0{stg.id + 1}
                  </span>
                  <span className="font-bold text-slate-800 text-[11px] block leading-snug truncate">
                    {stg.system}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                <span className={isDone ? 'font-semibold text-emerald-700' : 'text-slate-400'}>
                  {isDone ? 'Synced & Webhook OK' : 'Waiting...'}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync Log Response */}
      {syncResult && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Automated Interoperable Sync Completed ({syncResult.transaction_id})
            </span>
            <span className="text-[10px] font-mono text-emerald-700">{syncResult.timestamp}</span>
          </div>

          <div className="space-y-1 text-[11px] pt-1 border-t border-emerald-200/70">
            {syncResult.steps.map((st, sIdx) => (
              <div key={sIdx} className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <p>
                  <strong>{st.system}:</strong> {st.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossDeptSyncSimulator;
