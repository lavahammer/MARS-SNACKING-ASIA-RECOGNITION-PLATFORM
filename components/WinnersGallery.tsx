
import React, { useMemo } from 'react';
import { Vote, AggregatedVote } from '../types';
import { CATEGORIES } from '../constants';
import { Trophy, Star, ThumbsUp, Medal, Award } from 'lucide-react';

interface WinnersGalleryProps {
  votes: Vote[];
}

export const WinnersGallery: React.FC<WinnersGalleryProps> = ({ votes }) => {
  
  // Overall ranking logic
  const globalLeaderboard = useMemo(() => {
    const map = new Map<string, AggregatedVote>();
    
    votes.forEach(v => {
      const key = v.nomineeName.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, { 
            nomineeName: v.nomineeName, 
            nomineeDepartment: v.nomineeDepartment,
            nomineeLocation: v.nomineeLocation,
            count: 0, 
            categoryVotes: {} 
        });
      }
      const data = map.get(key)!;
      data.count++;
      data.categoryVotes[v.categoryId] = (data.categoryVotes[v.categoryId] || 0) + 1;
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [votes]);

  // Category specific ranking logic
  const categoryChampions = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catVotes = votes.filter(v => v.categoryId === cat.id);
      const map = new Map<string, {name: string, dept: string, count: number}>();
      
      catVotes.forEach(v => {
        const key = v.nomineeName.toLowerCase().trim();
        if (!map.has(key)) {
          map.set(key, { name: v.nomineeName, dept: v.nomineeDepartment, count: 0 });
        }
        map.get(key)!.count++;
      });

      const winner = Array.from(map.values()).sort((a, b) => b.count - a.count)[0];
      return { category: cat, winner };
    }).filter(item => item.winner);
  }, [votes]);

  const top3 = globalLeaderboard.slice(0, 3);
  const remaining = globalLeaderboard.slice(3);

  const getAvatarUrl = (name: string) => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-[#0000A0] tracking-tight">Mars Hall of Fame</h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Celebrating the associates who live our principles and drive our performance in Asia.</p>
      </div>

      {/* Podium Display */}
      <div className="mb-20">
        <h3 className="text-xl font-bold text-[#0000A0] mb-8 text-center flex items-center justify-center">
            <Trophy className="w-6 h-6 mr-2 text-[#b98c52]" />
            Top Recognized Associates
        </h3>
        <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-4 lg:gap-12">
            {/* 2nd Place */}
            {top3[1] && (
                <div className="flex flex-col items-center order-2 md:order-1 w-full md:w-auto">
                    <div className="relative mb-4 group">
                        <div className="absolute -top-3 -right-3 bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">2</div>
                        <img src={getAvatarUrl(top3[1].nomineeName)} className="w-24 h-24 rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full md:w-48">
                        <p className="font-bold text-gray-900 truncate">{top3[1].nomineeName}</p>
                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{top3[1].nomineeDepartment}</p>
                        <div className="mt-2 text-sm font-black text-gray-500">{top3[1].count} Recognitions</div>
                    </div>
                </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
                <div className="flex flex-col items-center order-1 md:order-2 w-full md:w-auto -mt-4">
                    <div className="relative mb-4 group scale-110">
                        <div className="absolute -top-5 -right-5 bg-yellow-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-xl animate-pulse">
                            <Medal className="w-6 h-6" />
                        </div>
                        <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-[#b98c52] to-[#ff6400]">
                            <img src={getAvatarUrl(top3[0].nomineeName)} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl group-hover:scale-105 transition-transform" />
                        </div>
                    </div>
                    <div className="text-center bg-[#0000A0] p-6 rounded-2xl shadow-xl w-full md:w-64 border-b-4 border-[#ff6400]">
                        <p className="font-black text-white text-lg truncate">{top3[0].nomineeName}</p>
                        <p className="text-[11px] uppercase text-blue-200 font-bold tracking-widest">{top3[0].nomineeDepartment}</p>
                        <div className="mt-3 inline-flex items-center px-4 py-1.5 bg-[#ff6400] text-white rounded-full text-xs font-black shadow-inner">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {top3[0].count} RECOGNITIONS
                        </div>
                    </div>
                </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
                <div className="flex flex-col items-center order-3 md:order-3 w-full md:w-auto">
                    <div className="relative mb-4 group">
                        <div className="absolute -top-3 -right-3 bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">3</div>
                        <img src={getAvatarUrl(top3[2].nomineeName)} className="w-24 h-24 rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full md:w-48">
                        <p className="font-bold text-gray-900 truncate">{top3[2].nomineeName}</p>
                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{top3[2].nomineeDepartment}</p>
                        <div className="mt-2 text-sm font-black text-[#ff6400]/70">{top3[2].count} Recognitions</div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Category Champions Section */}
      <div className="mb-20">
        <h3 className="text-xl font-bold text-[#0000A0] mb-8 flex items-center">
            <Award className="w-6 h-6 mr-2 text-[#ff6400]" />
            Category Champions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categoryChampions.map(({ category, winner }) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="bg-[#f8f9fc] px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#0000A0] tracking-wider">{category.title}</span>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <img src={getAvatarUrl(winner.name)} className="w-16 h-16 rounded-full mb-3 border-2 border-white shadow-sm" />
                        <p className="font-bold text-gray-900 text-sm text-center line-clamp-1">{winner.name}</p>
                        <p className="text-[10px] text-gray-500 mb-2">{winner.dept}</p>
                        <div className="text-xs font-black text-[#ff6400] flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {winner.count} Category Votes
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#0000A0]">Complete Leaderboard</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{globalLeaderboard.length} Associates Ranked</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase text-gray-400 tracking-wider bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-3">Rank</th>
                        <th className="px-6 py-3">Associate</th>
                        <th className="px-6 py-3">Department</th>
                        <th className="px-6 py-3 text-right">Recognitions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {globalLeaderboard.map((nominee, index) => (
                        <tr key={nominee.nomineeName} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4 text-sm font-bold text-gray-400 group-hover:text-[#0000A0]">#{index + 1}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <img className="h-8 w-8 rounded-full border border-gray-100 shadow-sm mr-3" src={getAvatarUrl(nominee.nomineeName)} alt="" />
                                    <span className="text-sm font-bold text-gray-800">{nominee.nomineeName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{nominee.nomineeDepartment}</td>
                            <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-gray-100 text-gray-600 group-hover:bg-[#ff6400] group-hover:text-white transition-colors">
                                    {nominee.count}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {globalLeaderboard.length === 0 && (
                <div className="p-20 text-center">
                    <Award className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No recognitions yet. Be the first to nominate!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
