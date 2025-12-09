
import { Post, NewPostPayload } from '../types';
import { supabase } from './supabase';

// Helper om IP op te halen via een externe service
const getIp = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch (e) {
    return 'unknown';
  }
};

export const api = {
  getPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    
    return (data || []).map((p: any) => ({
        ...p,
        id: p.id.toString() 
    })) as Post[];
  },

  createPost: async (payload: NewPostPayload): Promise<Post> => {
    const ip = await getIp();
    
    const dbPayload = {
      ...payload,
      timestamp: Date.now(),
      status: payload.type === 'admin' || payload.type === 'settings_ticker' ? 'approved' : 'pending',
      ip: ip
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;

    return { ...data, id: data.id.toString() } as Post;
  },

  updatePostStatus: async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const { error } = await supabase
      .from('posts')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
  },

  deletePost: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // --- TICKER FUNCTIES ---
  
  // Haalt de laatst aangemaakte ticker tekst op
  getTicker: async (): Promise<string> => {
      const { data } = await supabase
        .from('posts')
        .select('content')
        .eq('type', 'settings_ticker')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      return data ? data.content : '+++ Welkom op de site! +++ Laat een berichtje achter! +++ Hyves is back baby! +++';
  },

  // Slaat een nieuwe ticker tekst op (maakt een nieuwe entry aan, zodat we historie behouden)
  updateTicker: async (text: string): Promise<void> => {
      await api.createPost({
          author: 'System',
          content: text,
          type: 'settings_ticker'
      });
  },

  // --- AUTH ---

  login: async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        console.error("Login failed", error.message);
        return false;
    }
    return !!data.session;
  },
  
  checkSession: async (): Promise<boolean> => {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
  },

  logout: async (): Promise<void> => {
      await supabase.auth.signOut();
  }
};
