import React, { useState } from 'react';
import { Scale, BookOpen, ArrowRightLeft, Sparkles, Check } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export const UniversalUnitConverter = ({ isOpen, onClose }) => {
  const [val, setVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('guntha');
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' | 'lexicon'

  // Conversion table relative to Sq. Meters
  const unitsInSqm = {
    bigha_pakka: { name: 'Pakka Bigha (UP/Bihar/Haryana)', factor: 2529.3 },
    bigha_kaccha: { name: 'Kaccha Bigha (Rajasthan/MP)', factor: 843.0 },
    biswa: { name: 'Biswa (1/20th Bigha)', factor: 126.46 },
    guntha: { name: 'Guntha (Maharashtra/Karnataka/AP)', factor: 101.171 },
    are: { name: 'Are (100 Sq. Meters)', factor: 100.0 },
    hectare: { name: 'Hectare (100 Ares)', factor: 10000.0 },
    cent: { name: 'Cent (Tamil Nadu/Kerala)', factor: 40.4686 },
    ground: { name: 'Ground (Chennai Metro/TN)', factor: 222.96 },
    gaj: { name: 'Gaj / Sq. Yard (Urban India)', factor: 0.836127 },
    sq_ft: { name: 'Square Feet', factor: 0.092903 },
  };

  const currentNum = parseFloat(val) || 0;
  const inSqm = currentNum * (unitsInSqm[fromUnit]?.factor || 1);
  const inAcres = inSqm / 4046.8564;
  const inHectares = inSqm / 10000;
  const inGunthas = inSqm / 101.171;
  const inCents = inSqm / 40.4686;
  const inBigha = inSqm / 2529.3;
  const inGaj = inSqm / 0.836127;

  const glossary = [
    {
      term: 'ULPIN (Bhu-Aadhaar)',
      region: 'Pan-India (DoLR)',
      meaning: '14-digit alphanumeric Unique Land Parcel Identification Number based on WGS84 polygon vertices.',
    },
    {
      term: '7/12 & 8A (Satbara / Ath-A)',
      region: 'Maharashtra / Gujarat',
      meaning: 'Form 7 lists land rights & occupants; Form 12 lists crop & irrigation; 8A lists total landholding ledger.',
    },
    {
      term: 'Khatauni & Khasra',
      region: 'UP / MP / Haryana / Rajasthan',
      meaning: 'Khasra is the parcel survey plot number; Khatauni is the register of landholders and their shares.',
    },
    {
      term: 'Patta & Chitta',
      region: 'Tamil Nadu / Andhra Pradesh',
      meaning: 'Patta is the legal title deed issued by Tahsildar; Chitta provides village revenue land area classification.',
    },
    {
      term: 'RTC Pahani & Bhoomi',
      region: 'Karnataka',
      meaning: 'Record of Rights, Tenancy and Crops (RTC) digitized under the landmark Bhoomi land governance portal.',
    },
    {
      term: 'Urban Land Card (PR Card / TSLR)',
      region: 'Mumbai / Pune / Hyderabad (Metros)',
      meaning: 'Town Survey Land Register (TSLR) / Property Card maintained by Superintendent of Land Records for urban non-ag plots.',
    },
    {
      term: 'Ferfar / Dakhil-Kharij',
      region: 'Western & Northern India',
      meaning: 'Mutation of title in revenue records following sale deed, inheritance (varas), partition, or gift.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Universal Normalization & Terminology Engine"
      subtitle="Dynamic Pan-Indian Cadastral Unit Calculator & Lexicon"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Switcher Tab */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex items-center gap-1.5 py-2 px-4 border-b-2 font-semibold transition-colors ${
              activeTab === 'converter'
                ? 'border-gov-navy text-gov-navy'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Land Unit Normalizer</span>
          </button>
          <button
            onClick={() => setActiveTab('lexicon')}
            className={`flex items-center gap-1.5 py-2 px-4 border-b-2 font-semibold transition-colors ${
              activeTab === 'lexicon'
                ? 'border-gov-navy text-gov-navy'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pan-Indian Land Terminology Glossary</span>
          </button>
        </div>

        {activeTab === 'converter' ? (
          <div className="space-y-4">
            {/* Input Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Enter Native Quantity:
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-sm text-slate-900 focus:ring-2 focus:ring-gov-navy/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Native Regional Unit:
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-gov-navy/20"
                >
                  {Object.entries(unitsInSqm).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Standard Normalized Results Cards */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Standard Metric SI & Pan-Indian Equivalents
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                    Square Meters (sq.m)
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {Math.round(inSqm).toLocaleString()} sq.m
                  </span>
                  <span className="text-[10px] text-slate-500">Standard SI Unit</span>
                </div>

                <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                  <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">
                    Standard Acres
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {inAcres.toFixed(3)} Acres
                  </span>
                  <span className="text-[10px] text-slate-500">1 Acre = 4,046.86 sq.m</span>
                </div>

                <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50">
                  <span className="text-[10px] text-purple-800 font-bold uppercase tracking-wider block">
                    Hectares
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    {inHectares.toFixed(3)} Ha
                  </span>
                  <span className="text-[10px] text-slate-500">1 Ha = 10,000 sq.m</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold block">Gunthas (MH/KA)</span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5">{inGunthas.toFixed(2)} Gunthas</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold block">Cents (TN/KL)</span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5">{inCents.toFixed(2)} Cents</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 font-bold block">Pakka Bigha (UP/MP)</span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5">{inBigha.toFixed(2)} Bigha</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {glossary.map((g, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gov-navy text-xs">{g.term}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {g.region}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{g.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UniversalUnitConverter;
