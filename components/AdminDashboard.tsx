
import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants';
import { Vote } from '../types';
import { Bot, RefreshCw, AlertCircle, History, User, MapPin, Award, TrendingUp, Activity } from 'lucide-react';
import { generateAdminSummary } from '../services/geminiService';

interface AdminDashboardProps {
  votes: Vote[];
}

// Custom Mars-Native Horizontal Bar Chart Component (for Nominees)
const MarsBarChart = ({ data }: { data: { name: string, count: number }[] }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="space-y-6 w-full h-full flex flex-col justify-center">
      {data.map((item, i) => (
        <div key={item.name} className="group">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-black text-gray-500 uppercase tracking-tight truncate max-w-[150px]">{item.name}</span>
            <span className="text-xs font-black text-[#0000A0] bg-blue-50 px-2 py-0.5 rounded-md">{item.count}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full bg-[#0000A0] rounded-full transition-all duration-1000 ease-out origin-left"
              style={{ 
                width: `${(item.count / maxCount) * 100}%`,
                transitionDelay: `${i * 100}ms`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Custom Mars-Native Column Chart Component (for Value Alignment)
const MarsColumnChart = ({ data }: { data: { name: string, value: number }[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ['#0000A0', '#ff6400', '#b98c52', '#4338CA', '#059669'];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chart Area */}
      <div className="flex-1 flex items-end justify-around gap-2 min-h-[220px] px-2 border-b border-gray-100 pb-2">
        {data.map((item, i) => {
          const heightPercent = (item.value / maxVal) * 90; // Leave 10% for the label on top
          return (
            <div key={item.name} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Value label on top */}
              <span className="text-[10px] font-black text-[#0000A0] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </span>
              
              {/* The Column */}
              <div 
                className="w-full max-w-[40px] rounded-t-lg transition-all duration-1000 ease-out shadow-sm relative overflow-hidden"
                style={{ 
                  height: `${heightPercent}%`, 
                  backgroundColor: COLORS[i % COLORS.length],
                  transitionDelay: `${i * 50}ms`
                }}
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              
              {/* Axis Label (Truncated) */}
              <div className="mt-3 w-full text-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter truncate block px-1">
                  {item.name.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend / Detail List */}
      <div className="mt-8 space-y-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
              <span className="text-gray-600 uppercase tracking-tight">{item.name}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-900 font-black">{item.value}</span>
              <span className="text-[#ff6400] font-black">{Math.round((item.value / total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ votes }) => {
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const stats = useMemo(() => {
    if (!votes.length) return null;
    const nomineeCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    votes.forEach(v => {
      nomineeCounts[v.nomineeName] = (nomineeCounts[v.nomineeName] || 0) + 1;
      categoryCounts[v.categoryId] = (categoryCounts[v.categoryId] || 0) + 1;
      locationCounts[v.nomineeLocation] = (locationCounts[v.nomineeLocation] || 0) + 1;
    });

    const topNominee = Object.entries(nomineeCounts).sort((a, b) => b[1] - a[1])[0];
    const topCatId = Object.entries(categoryCounts).length > 0 ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0] : 'c1';
    const topLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      leader: topNominee[0],
      leaderCount: topNominee[1],
      category: CATEGORIES.find(c => c.id === topCatId)?.title || 'Excellence',
      location: topLocation[0],
      locationCount: topLocation[1]
    };
  }, [votes]);

  const nomineeData = useMemo(() => {
    const counts: Record<string, number> = {};
    votes.forEach(v => { counts[v.nomineeName] = (counts[v.nomineeName] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [votes]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    votes.forEach(v => {
      const title = CATEGORIES.find(c => c.id === v.categoryId)?.title || 'Service';
      counts[title] = (counts[title] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [votes]);

  const handleGenerateSummary = async () => {
    if (votes.length === 0) return;
    setLoadingSummary(true);
    const text = await generateAdminSummary(votes);
    setSummary(text);
    setLoadingSummary(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#0000A0] tracking-tighter uppercase leading-none">Strategy & Analytics</h2>
          <div className="flex items-center mt-3 gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Node Sync Active</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-end min-w-[160px]">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Regional Impact</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#0000A0]">{votes.length}</span>
              <span className="text-[10px] font-black text-[#ff6400]">VOL</span>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:bg-[#0000A0] hover:text-white text-[#ff6400] transition-all group active:scale-95 shadow-md">
            <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {votes.length > 0 ? (
        <>
          {/* KPI Highlighters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#0000A0] to-blue-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
              <User className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 w-32 h-32" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Associate Leader</p>
              <h4 className="text-2xl font-black truncate z-10 relative">{stats?.leader}</h4>
              <div className="mt-6 flex items-center gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{stats?.leaderCount} Recognition Points</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <Award className="absolute right-0 bottom-0 p-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform duration-700 w-32 h-32" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">Core Pillar</p>
              <h4 className="text-2xl font-black text-[#ff6400] truncate z-10 relative">{stats?.category}</h4>
              <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Regional Priority</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <MapPin className="absolute right-0 bottom-0 p-4 text-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-700 w-32 h-32" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">Peak Hub</p>
              <h4 className="text-2xl font-black text-[#0000A0] truncate z-10 relative">{stats?.location}</h4>
              <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stats?.locationCount} Distinct Actions</p>
            </div>
          </div>

          {/* Optimized Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-10">
                <TrendingUp className="w-5 h-5 text-[#0000A0]" />
                <h3 className="font-black text-[#0000A0] uppercase tracking-[0.2em] text-[12px]">Top Nominee Engagement</h3>
              </div>
              <div className="flex-1">
                <MarsBarChart data={nomineeData} />
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-10">
                <Award className="w-5 h-5 text-[#ff6400]" />
                <h3 className="font-black text-[#ff6400] uppercase tracking-[0.2em] text-[12px]">Value Alignment Summary</h3>
              </div>
              <div className="flex-1">
                <MarsColumnChart data={categoryData} />
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-blue-100 relative overflow-hidden shadow-inner">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
              <div className="h-24 w-24 shrink-0 bg-[#0000A0] rounded-3xl shadow-2xl flex items-center justify-center">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-[#0000A0] mb-2 uppercase tracking-tight">Strategic Synthesis</h3>
                <p className="text-sm text-gray-500 mb-8 font-medium max-w-2xl leading-relaxed italic">"Our AI engine is processing current regional interactions to quantify Mars culture growth."</p>
                
                {summary ? (
                  <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-[#ff6400] animate-in slide-in-from-bottom-5 duration-500">
                    <p className="text-gray-800 text-lg font-bold leading-relaxed">{summary}</p>
                    <button onClick={handleGenerateSummary} className="mt-6 text-[11px] font-black text-[#0000A0] uppercase tracking-[0.2em] hover:text-[#ff6400] flex items-center gap-2">
                      <RefreshCw size={14} /> Recalculate Insights
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={loadingSummary}
                    className="bg-[#0000A0] text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-900 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                  >
                    {loadingSummary ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run Business Analysis'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Feed */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/20">
              <h3 className="text-[11px] font-black text-[#0000A0] uppercase tracking-[0.3em] flex items-center gap-3">
                <History className="w-4 h-4" />
                Raw Recognition Pipeline
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5">Associate</th>
                    <th className="px-10 py-5">Pillar</th>
                    <th className="px-10 py-5">Location Hub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {votes.slice(0, 10).map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50/20 transition-all group">
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Synced</span>
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0000A0]">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{v.nomineeName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{v.nomineeDepartment}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        <span className="inline-block text-[10px] font-black px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-tight">
                          {CATEGORIES.find(c => c.id === v.categoryId)?.title || 'Service'}
                        </span>
                      </td>
                      <td className="px-10 py-5">
                        <span className="text-[11px] font-bold text-gray-500 uppercase">{v.nomineeLocation} Hub</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100 text-center px-10">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
            <AlertCircle className="w-12 h-12 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-300 uppercase tracking-[0.2em]">Regional Buffer Empty</h3>
          <p className="text-gray-400 text-sm mt-4 font-medium max-w-md">No cultural recognitions have been synchronized from the Asia hub yet. Nominations made in the 'Vote' tab will appear here instantly.</p>
        </div>
      )}
    </div>
  );
};
