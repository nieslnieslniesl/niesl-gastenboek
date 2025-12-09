import React, { useState, useEffect } from 'react';
import { Post, NewPostPayload } from './types';
import { api } from './services/api';
import FeedItem from './components/FeedItem';
import GuestbookForm from './components/GuestbookForm';
import AdminDashboard from './components/AdminDashboard';
import Button from './components/Button';
import Sparkles from './components/Sparkles';
import Loading from './components/Loading';

// Styles for the main layout to mimic Hyves
const LAYOUT_STYLES = {
  container: "min-h-screen font-sans bg-gradient-to-br from-cyan-400 via-pink-400 to-yellow-300 pb-20 relative overflow-x-hidden",
  header: "bg-white/90 backdrop-blur-sm border-b-4 border-pink-500 shadow-md sticky top-0 z-40",
  mainColumn: "max-w-2xl mx-auto bg-white/80 min-h-screen border-l-4 border-r-4 border-white/50 shadow-2xl backdrop-blur-md",
};

const App: React.FC = () => {
  // --- STATE ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [view, setView] = useState<'home' | 'guestbook_form' | 'admin_login' | 'admin_dashboard'>('home');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- INIT DATA ---
  const fetchPosts = async () => {
    try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
    } catch (e) {
        console.error("Failed to fetch", e);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Check if admin is already logged in from previous session
    api.checkSession().then(isAuth => {
        if(isAuth) setIsAdminAuthenticated(true);
    });
  }, []);

  // --- ACTIONS (Async) ---

  const handleNewGuestbookEntry = async (payload: NewPostPayload) => {
    try {
        await api.createPost(payload);
        await fetchPosts(); 
        setView('home');
        alert('Bedankt voor je krabbel! Hij verschijnt zodra de admin hem goedkeurt.');
    } catch (e) {
        alert('Er ging iets mis met opslaan. Probeer het later nog eens!');
    }
  };

  const handleNewAdminPost = async (payload: NewPostPayload) => {
    await api.createPost(payload);
    await fetchPosts();
  };

  const handleApprove = async (id: string) => {
    await api.updatePostStatus(id, 'approved');
    // Optimistic update
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const handleReject = async (id: string) => {
    await api.updatePostStatus(id, 'rejected');
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Weet je zeker dat je dit wilt verwijderen?")) {
        await api.deletePost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
      }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    const success = await api.login(emailInput, passwordInput);
    
    setIsLoggingIn(false);

    if (success) {
      setIsAdminAuthenticated(true);
      setView('admin_dashboard');
      setEmailInput('');
      setPasswordInput('');
    } else {
      alert('Inloggen mislukt. Check je email en wachtwoord!');
    }
  };

  const handleLogout = async () => {
      await api.logout();
      setIsAdminAuthenticated(false);
      setView('home');
  };

  // --- RENDER HELPERS ---

  const feedPosts = posts
    .filter(p => p.status === 'approved')
    .sort((a, b) => b.timestamp - a.timestamp);

  // --- VIEWS ---

  if (view === 'admin_dashboard' && isAdminAuthenticated) {
    return (
      <AdminDashboard 
        posts={posts}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onAddAdminPost={handleNewAdminPost}
        onRefresh={fetchPosts}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className={LAYOUT_STYLES.container}>
      <Sparkles />
      
      {/* HEADER */}
      <header className={LAYOUT_STYLES.header}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 
            className="text-3xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 drop-shadow-sm cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setView('home')}
            style={{ fontFamily: '"Arial Black", "Impact", sans-serif' }}
          >
            Niesl.nl
          </h1>
          <div className="flex gap-2">
             <button onClick={() => setView('admin_login')} className="text-xs opacity-50 hover:opacity-100 font-mono text-pink-500 underline">
                Admin
             </button>
          </div>
        </div>
        <div className="bg-yellow-300 py-1 overflow-hidden border-b border-black">
             <div className="animate-marquee whitespace-nowrap text-sm font-bold uppercase tracking-widest">
                 +++ Welkom op de site! +++ Laat een berichtje achter! +++ Hyves is back baby! +++ Kusjes van Niesl +++
             </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className={LAYOUT_STYLES.mainColumn}>
        
        {/* Content Feed */}
        <div className="p-4 md:p-8">
            
            {view === 'admin_login' && (
                <div className="max-w-sm mx-auto bg-white p-8 rounded-xl shadow-2xl border-4 border-gray-800 mt-10">
                    <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                    <form onSubmit={handleAdminLogin}>
                        <input 
                            type="email" 
                            className="w-full border-2 border-black p-2 mb-2 rounded bg-gray-100" 
                            placeholder="Email..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            disabled={isLoggingIn}
                            required
                        />
                        <input 
                            type="password" 
                            className="w-full border-2 border-black p-2 mb-4 rounded bg-gray-100" 
                            placeholder="Wachtwoord..."
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            disabled={isLoggingIn}
                            required
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 italic">Login via Supabase</span>
                            <Button type="submit" disabled={isLoggingIn}>
                                {isLoggingIn ? 'Even checken...' : 'Inloggen'}
                            </Button>
                        </div>
                    </form>
                    <button onClick={() => setView('home')} className="mt-4 text-sm text-center w-full underline">Terug</button>
                </div>
            )}

            {view === 'guestbook_form' && (
                <GuestbookForm 
                    onSubmit={handleNewGuestbookEntry}
                    onCancel={() => setView('home')}
                />
            )}

            {view === 'home' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-yellow-400 inline-block pr-4 rotate-[-2deg]">
                            Laatste Updates & Krabbels
                        </h2>
                        <Button 
                            variant="primary" 
                            size="md" 
                            onClick={() => setView('guestbook_form')}
                            className="animate-pulse"
                        >
                            ✏️ Berichtje achterlaten
                        </Button>
                    </div>

                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="space-y-6">
                            {feedPosts.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 font-bold text-xl">
                                    Nog geen berichtjes... wees de eerste!
                                </div>
                            ) : (
                                feedPosts.map(post => (
                                    <FeedItem key={post.id} post={post} />
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-white/80 pb-8 font-bold text-xs uppercase tracking-widest drop-shadow-md">
         © 2004 - 2025 Niesl.nl | Made with typical Hyves energy ✨
      </footer>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        .animate-bounce-in {
            animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .font-comic {
            font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;
