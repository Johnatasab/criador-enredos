import { supabase } from './supabase.js';

//Guarda o usuário logado e notifica os listeners quando ele muda. O usuário é nulo quando não há ninguém logado.
let currentUser = null;
const listeners = new Set();

//Utilitário para atualizar o usuário logado e notificar os listeners. Se o usuário não mudou, não faz nada.
function setUser(user) {
    const sameUser = user?.id === currentUser?.id;
    if (sameUser) return;
    currentUser = user;
    listeners.forEach((fn) => { 
        try { fn(user); } catch (err) { console.error('[auth listener]', err); }
     });
}

export const auth = {
    get current() {
        return currentUser;
    },

    async init() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(data.session?.user ?? null);

        supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
    },

    onChange(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },

    async signInWithGoogle() {
        const redirectTo = window.location.origin + window.location.pathname;
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
        if (error) throw error;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },
};