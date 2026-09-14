import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const MonthlyMutationsChart = ({ data = [] }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar dataKey="applied" name="Applications Received" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="approved" name="Approved & Mutated" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="rejected" name="Rejected / Contested" fill="#F43F5E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const defaultZoningData = [
  { name: 'Residential', count: 4, area_sqm: 17275, color: '#3B82F6' },
  { name: 'Commercial', count: 3, area_sqm: 11216, color: '#EF4444' },
  { name: 'Agricultural', count: 1, area_sqm: 9105, color: '#16A34A' },
  { name: 'Industrial', count: 1, area_sqm: 3561, color: '#9333EA' },
  { name: 'Eco-sensitive', count: 1, area_sqm: 2428, color: '#0D9488' },
];

export const ZoningDistributionChart = ({ data = [] }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : defaultZoningData;

  return (
    <div className="w-full h-72 flex flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, item) => [
              `${value} parcels (${(item?.payload?.area_sqm || 0).toLocaleString()} sq.m)`,
              name,
            ]}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-600 mt-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name} ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export const PredictiveRevenueForecastChart = ({ data = [] }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="aiProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="baselineRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="year" tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `₹${v}L`} />
          <Tooltip
            formatter={(value) => [`₹ ${value} Lakhs`, '']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
          <Area
            type="monotone"
            dataKey="baseline"
            name="Legacy Status Quo Baseline"
            stroke="#64748B"
            fillOpacity={1}
            fill="url(#baselineRevenue)"
          />
          <Area
            type="monotone"
            dataKey="projected"
            name="AI-Optimized Land Stack Realization"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#aiProjected)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  MonthlyMutationsChart,
  ZoningDistributionChart,
  PredictiveRevenueForecastChart,
};
