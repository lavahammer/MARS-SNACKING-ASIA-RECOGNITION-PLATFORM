
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { VotingSection } from './components/VotingSection';
import { AdminDashboard } from './components/AdminDashboard';
import { WinnersGallery } from './components/WinnersGallery';
import { Vote, ViewState } from './types';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('VOTE');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  const mapVote = useCallback((row: any): Vote => ({
    id: row.id || Math.random().toString(36).substr(2, 9),
    nomineeName: row.nominee_name || 'Anonymous Associate',
    nomineeDepartment: row.nominee_department || 'General',
    nomineeLocation: row.nominee_location || 'Asia Hub',
    categoryId: row.category_id || 'c1',
    nominatorName: row.nominator_name || 'Associate',
    reason: row.reason || '',
    timestamp: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  }), []);

  const fetchVotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        setVotes([]);
      } else if (data && data.length > 0) {
        setVotes(data.map(mapVote));
      } else {
        // Table is empty - no dummy data shown
        setVotes([]);
      }
    } catch (err: any) {
      console.error('Connection error:', err.message);
      setVotes([]);
    } finally {
      setLoading(false);
    }
  }, [mapVote]);

  useEffect(() => {
    fetchVotes();

    const channel = supabase
      .channel('public-votes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        (payload) => {
          const newVote = mapVote(payload.new);
          setVotes((prev) => {
            if (prev.some(v => v.id === newVote.id)) return prev;
            return [newVote, ...prev];
          });
          if (currentView !== 'VOTE') {
            toast('New recognition received!', { icon: '✨', position: 'bottom-left' });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVotes, currentView, mapVote]);

  const handleVote = async (name: string, dept: string, location: string, categoryId: string, reason: string) => {
    const loadingToast = toast.loading('Submitting recognition...');

    try {
      const { error } = await supabase
        .from('votes')
        .insert([
          {
            nominee_name: name,
            nominee_department: dept,
            nominee_location: location,
            category_id: categoryId,
            nominator_name: 'Associate',
            reason: reason,
          },
        ]);

      toast.dismiss(loadingToast);

      if (error) throw error;
      
      toast.success('Recognition submitted successfully!');
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error('Submission error:', err.message);
      toast.error('Submission failed. Check your internet connection.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0000A0] mb-4"></div>
          <p className="text-[#0000A0] font-medium animate-pulse text-sm uppercase tracking-widest">Accessing Mars Global Cloud...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'VOTE': return <VotingSection onVote={handleVote} />;
      case 'ADMIN': return <AdminDashboard votes={votes} />;
      case 'WINNERS': return <WinnersGallery votes={votes} />;
      default: return <VotingSection onVote={handleVote} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Toaster position="bottom-right" />
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-grow pb-12">
        {renderContent()}
      </main>
      <footer className="bg-[#0000A0] text-white py-12 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">
                    Mars Live Feed: Synchronized
                </span>
            </div>
            <p className="text-sm opacity-80 mb-2 font-bold">Mars Snacking Asia Excellence Platform</p>
            <p className="text-[10px] opacity-40 uppercase tracking-widest">&copy; 2024 Mars Snacking. Confidential & Proprietary.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
