
import React, { useState } from 'react';
import { Category } from '../types';
import { CATEGORIES, DEPARTMENTS, LOCATIONS } from '../constants';
import { Award, Sparkles, Send, User, MapPin, Building2 } from 'lucide-react';
import { generateNominationReason } from '../services/geminiService';
import { toast } from 'react-hot-toast';

interface VotingSectionProps {
  onVote: (name: string, dept: string, location: string, categoryId: string, reason: string) => void;
}

export const VotingSection: React.FC<VotingSectionProps> = ({ onVote }) => {
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeDept, setNomineeDept] = useState(DEPARTMENTS[0]);
  const [nomineeLocation, setNomineeLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [reason, setReason] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!keywords.trim() || !nomineeName.trim()) {
        toast.error('Please enter a name and a few keywords.');
        return;
    }
    setIsGenerating(true);
    const text = await generateNominationReason(nomineeName, selectedCategory.title, keywords);
    setReason(text);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomineeName && reason && selectedCategory) {
      onVote(nomineeName, nomineeDept, nomineeLocation, selectedCategory.id, reason);
      setNomineeName('');
      setReason('');
      setKeywords('');
      setNomineeDept(DEPARTMENTS[0]);
      setNomineeLocation(LOCATIONS[0]);
      window.scrollTo(0, 0);
    } else {
        toast.error('Please complete all fields.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#0000A0]">Associate Recognition</h2>
        <p className="mt-2 text-gray-600">Empower your peers across Mars Snacking Asia through thoughtful recognition.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#0000A0] px-6 py-4">
            <h3 className="text-white font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Nominee Information
            </h3>
        </div>
        
        <div className="p-8 space-y-8">
            {/* Nominee Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Colleague's Full Name</label>
                    <input 
                        type="text" 
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        placeholder="Who are we celebrating today?"
                        className="w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-[#0000A0] focus:ring-2 focus:ring-[#0000A0] focus:ring-opacity-20 p-3.5 border transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                        <select 
                            value={nomineeDept}
                            onChange={(e) => setNomineeDept(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-[#0000A0] focus:ring-2 focus:ring-[#0000A0] focus:ring-opacity-20 p-3.5 pl-11 border transition-all appearance-none"
                        >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location Hub</label>
                    <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                         <select 
                            value={nomineeLocation}
                            onChange={(e) => setNomineeLocation(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-[#0000A0] focus:ring-2 focus:ring-[#0000A0] focus:ring-opacity-20 p-3.5 pl-11 border transition-all appearance-none"
                        >
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Category Selection */}
            <div>
                <label className="block text-lg font-bold text-[#0000A0] mb-5">Award Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-300 ${
                                selectedCategory.id === cat.id 
                                ? 'border-[#ff6400] bg-orange-50 ring-2 ring-[#ff6400] ring-opacity-20' 
                                : 'border-gray-200 bg-white hover:border-[#b98c52] hover:bg-gray-50'
                            }`}
                        >
                            <div className={`p-2.5 rounded-full mb-3 ${selectedCategory.id === cat.id ? 'bg-[#ff6400] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-800 leading-tight uppercase tracking-tight">{cat.title}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-5 p-4 bg-[#0000A0]/5 rounded-xl border border-[#0000A0]/10 text-sm text-[#0000A0]">
                    <span className="font-bold">{selectedCategory.title}:</span> {selectedCategory.description}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Reason Section with AI */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Recognition Narrative</label>
                    <div className="flex w-full sm:w-auto space-x-2">
                        <input 
                            type="text" 
                            placeholder="Add keywords..." 
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="text-sm bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0000A0] focus:border-[#0000A0] flex-grow"
                        />
                        <button 
                            type="button"
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isGenerating ? 'Drafting...' : <><Sparkles className="w-4 h-4 mr-2"/> AI Draft</>}
                        </button>
                    </div>
                </div>
                <textarea
                    rows={6}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-[#0000A0] focus:ring-2 focus:ring-[#0000A0] focus:ring-opacity-20 p-4 border transition-all"
                    placeholder="Share the impact this associate has made..."
                ></textarea>
                <p className="mt-2 text-[11px] text-gray-400 italic">Authentic recognition drives our culture forward.</p>
            </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex justify-end">
            <button
                onClick={handleSubmit}
                className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-[#ff6400] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6400] transition-all transform hover:scale-[1.02]"
            >
                <Send className="w-5 h-5 mr-2" />
                Publish Recognition
            </button>
        </div>
      </div>
    </div>
  );
};
