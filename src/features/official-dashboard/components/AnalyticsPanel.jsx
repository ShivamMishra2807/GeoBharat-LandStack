import React, { useEffect, useState } from 'react';
import { authApi } from '../../../api/authApi';
import { formatINR } from '../../../utils/formatters';
import { BarChart3, TrendingUp, ShieldCheck, MapPin, IndianRupee, Layers, Sparkles, Brain, AlertCircle, Users } from 'lucide-react';
import StatCard from '../../../components/ui/StatCard';
import { MonthlyMutationsChart, ZoningDistributionChart, PredictiveRevenueForecastChart } from '../../../components/charts/AnalyticsChart';

export const AnalyticsPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await authApi.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Predictive dataset modeling 3-year fiscal impact under Land Stack integration
  const predictiveRevenueData = [
    { year: '2023 (Legacy)', baseline: 42, projected: 42 },
    { year: '2024 (Pilot Rollout)', baseline: 45, projected: 58 },
    { year: '2025 (DoLR Phase 2)', baseline: 48, projected: 74 },
    { year: '2026 (Full Land Stack)', baseline: 51, projected: 96 },
    { year: '2027 (Projected Steady)', baseline: 54, projected: 118 },
  ];

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Loading revenue, cadastral and predictive analytics...
      </div>
    );
  }

  const s = data.summary || {};

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Surveyed Cadastral Parcels"
          value={s.total_parcels}
          subtitle={`Includes DoLR Chandigarh & TN Pilots`}
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Mutation SLA Compliance"
          value={s.mutation_success_rate}
          trend="+3.4% turnaround boost"
          trendPositive={true}
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title="Municipal Tax Realization"
          value={formatINR(s.revenue_collected_inr)}
          subtitle={`Collection Rate: ${s.tax_collection_rate}`}
          icon={IndianRupee}
          variant="amber"
        />
        <StatCard
          title="Active Court / Buffer Stays"
          value={s.active_disputes}
          trend="2 Parcels Under Caution"
          trendPositive={false}
          icon={BarChart3}
          variant="rose"
        />
      </div>

      {/* Predictive Analytics & AI Decision Support Section */}
      <div className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Predictive Fiscal & Inflow Forecast Model
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-semibold px-2 py-0.5 rounded-full">
                  AI Decision Support
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Machine learning projection modeling revenue buoyancy and mutation surge under Land Stack 100% ULPIN georeferencing
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Predictive Revenue Chart */}
          <div className="lg:col-span-8">
            <PredictiveRevenueForecastChart data={predictiveRevenueData} />
          </div>

          {/* AI Decision Support Insights */}
          <div className="lg:col-span-4 space-y-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-1">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                Projected Revenue Buoyancy
              </span>
              <span className="text-xl font-extrabold text-slate-900">+118.5% Growth</span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Automated SRO-to-ULB syncing identifies previously unassessed illegal sub-divisions, expanding tax register by 2.3x.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                Predictive Surge Alert
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Harvest Mutation Inflow (+35%)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Historical seasonal cycle predicts 45 additional mutation filings next month. Deploy +2 Circle Officers to maintain 15-day SLA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical & Diagnostic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Mutations Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Monthly Land Mutation Inflows
              </h4>
              <p className="text-xs text-slate-500">
                Application inflows, approvals, and legal rejections
              </p>
            </div>
            <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
              CY 2024
            </span>
          </div>
          <MonthlyMutationsChart data={data.mutations_monthly} />
        </div>

        {/* Master Plan Zoning Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Master Plan Zoning Distribution
              </h4>
              <p className="text-xs text-slate-500">
                Spatial land use classification across surveyed parcels
              </p>
            </div>
            <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              Regional Plan
            </span>
          </div>
          <ZoningDistributionChart data={data.zoning_distribution} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
