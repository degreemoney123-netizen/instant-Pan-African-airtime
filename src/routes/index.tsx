import { useState, useMemo } from 'react';
import { AFRICAN_COUNTRIES } from './constants/africa';

export default function UtilityPlatform() {
  const [selectedCountry, setSelectedCountry] = useState(AFRICAN_COUNTRIES[0]);
  const [activeTab, setActiveTab] = useState('Mobile Data');
  
  // Filter providers based on tab and country
  const availableProviders = useMemo(() => {
    const categoryMap: Record<string, keyof typeof selectedCountry.providers> = {
      'Mobile Data': 'mobile',
      'Airtime Top-Up': 'mobile',
      'Electricity Tokens': 'electricity',
      'TV & Cable Subscriptions': 'tv',
      'Water Bills': 'water'
    };
    return selectedCountry.providers[categoryMap[activeTab]] || [];
  }, [selectedCountry, activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 1. Top Header Selector */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border mb-6">
        <select 
          onChange={(e) => setSelectedCountry(AFRICAN_COUNTRIES.find(c => c.code === e.target.value)!)}
          className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
        >
          {AFRICAN_COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
          ))}
        </select>
      </div>

      {/* 2. Service Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 border-b pb-2">
        {['Mobile Data', 'Airtime Top-Up', 'Electricity Tokens', 'TV & Cable Subscriptions', 'Water Bills'].map(tab => (
          <button 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 whitespace-nowrap rounded-t-lg ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Dynamic Form */}
      <form className="space-y-4 bg-white p-6 rounded-xl border">
        <div>
          <label className="block text-sm font-medium mb-1">Select Provider</label>
          <select className="w-full p-3 border rounded-lg">
            {availableProviders.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {activeTab.includes('Electricity') ? 'Meter Number' : 
             activeTab.includes('TV') ? 'Smartcard/IUC Number' : 'Phone Number'}
          </label>
          <div className="relative">
            {!activeTab.includes('Electricity') && !activeTab.includes('TV') && (
              <span className="absolute left-3 top-3 text-gray-500">{selectedCountry.phoneCode}</span>
            )}
            <input 
              type="text" 
              className={`w-full p-3 border rounded-lg ${!activeTab.includes('Electricity') && !activeTab.includes('TV') ? 'pl-16' : ''}`}
              placeholder="Enter ID or Number"
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">
          Pay in {selectedCountry.currency}
        </button>
      </form>
    </div>
  );
}
