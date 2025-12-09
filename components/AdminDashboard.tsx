
import React, { useState, useEffect } from 'react';
import { Post, NewPostPayload } from '../types';
import FeedItem from './FeedItem';
import Button from './Button';
import Loading from './Loading';

interface AdminDashboardProps {
  posts: Post[];
  isLoading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddAdminPost: (payload: NewPostPayload) => Promise<void>;
  onUpdateTicker: (text: string) => Promise<void>;
  currentTicker: string;
  onLogout: () => void;
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  posts,
  isLoading,
  onApprove,
  onReject,
  onDelete,
  onAddAdminPost,
  onUpdateTicker,
  currentTicker,
  onLogout,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'cms'>('moderation');
  const [adminPostContent, setAdminPostContent] = useState('');
  const [tickerContent, setTickerContent] = useState(currentTicker);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Update local state when prop changes (initial load)
  useEffect(() => {
      setTickerContent(currentTicker);
  }, [currentTicker]);

  // Filter lists
  const pendingPosts = posts.filter(p => p.status === 'pending').sort((a,b) => b.timestamp - a.timestamp);
  const adminPosts = posts.filter(p => p.type === 'admin').sort((a,b) => b.timestamp - a.timestamp);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPostContent.trim()) return;
    
    setIsActionLoading(true);
    await onAddAdminPost({
        author: 'Niesl (Admin)',
        content: adminPostContent,
        type: 'admin',
    });
    setAdminPostContent('');
    setIsActionLoading(false);
    alert('Tekstblok toegevoegd!');
  };

  const handleSaveTicker = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsActionLoading(true);
      await onUpdateTicker(tickerContent);
      setIsActionLoading(false);
      alert('Ticker balk bijgewerkt!');
  };

  const wrapAction = async (action: () => Promise<void>) => {
      setIsActionLoading(true);
      await action();
      setIsActionLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden">
        
        {/* Admin Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold font-mono">🔧 NIESL.NL ADMIN</h1>
            <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onRefresh}>↻ Verversen</Button>
                <Button variant="danger" size="sm" onClick={onLogout}>Uitloggen</Button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-gray-800">
            <button 
                onClick={() => setActiveTab('moderation')}
                className={`flex-1 p-4 font-bold text-lg text-center transition-colors ${activeTab === 'moderation' ? 'bg-yellow-300 text-black' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            >
                Moderatie ({pendingPosts.length})
            </button>
            <button 
                onClick={() => setActiveTab('cms')}
                className={`flex-1 p-4 font-bold text-lg text-center transition-colors ${activeTab === 'cms' ? 'bg-cyan-300 text-black' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            >
                CMS / Site Beheer
            </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 relative">
            {(isLoading || isActionLoading) && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loading />
                </div>
            )}
            
            {/* MODERATION TAB */}
            {activeTab === 'moderation' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-black pb-2">Wachtrij voor goedkeuring</h2>
                    {pendingPosts.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded border border-dashed border-gray-300">
                            Geen nieuwe berichten. Tijd voor koffie! ☕
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingPosts.map(post => (
                                <FeedItem 
                                    key={post.id} 
                                    post={post} 
                                    isAdminView 
                                    onApprove={(id) => wrapAction(() => onApprove(id))}
                                    onReject={(id) => wrapAction(() => onReject(id))}
                                    onDelete={(id) => wrapAction(() => onDelete(id))}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CMS TAB */}
            {activeTab === 'cms' && (
                <div className="space-y-8">
                    
                    {/* TICKER EDITOR */}
                    <div className="bg-yellow-100 p-6 rounded-xl border-2 border-yellow-400 shadow-md">
                        <h3 className="font-bold text-lg mb-2 text-yellow-800">📢 Ticker Balk (Lopende tekst)</h3>
                        <form onSubmit={handleSaveTicker} className="flex gap-2">
                            <input 
                                type="text"
                                className="flex-1 border-2 border-yellow-500 rounded p-2 focus:ring-2 focus:ring-yellow-600 outline-none font-mono"
                                value={tickerContent}
                                onChange={e => setTickerContent(e.target.value)}
                                placeholder="+++ Typ hier je lopende tekst... +++"
                            />
                            <Button type="submit" variant="secondary" size="sm">Opslaan</Button>
                        </form>
                    </div>

                    {/* NEW POST EDITOR */}
                    <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-md">
                        <h3 className="font-bold text-lg mb-2 text-blue-800">📝 Nieuw Tekstblok Toevoegen</h3>
                        <form onSubmit={handleCreatePost}>
                            <textarea 
                                className="w-full border-2 border-blue-300 rounded p-3 h-32 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Typ hier je update voor op de homepage... (Gebruik **bold** voor dikgedrukt)"
                                value={adminPostContent}
                                onChange={e => setAdminPostContent(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" variant="primary">Plaats op Homepage</Button>
                            </div>
                        </form>
                    </div>

                    <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Actieve Tekstblokken</h2>
                    <div className="space-y-4">
                        {adminPosts.map(post => (
                             <FeedItem 
                                key={post.id} 
                                post={post} 
                                isAdminView 
                                onDelete={(id) => wrapAction(() => onDelete(id))}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
