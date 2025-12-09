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
      status: payload.type === 'admin' ? 'approved' : 'pending',
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
