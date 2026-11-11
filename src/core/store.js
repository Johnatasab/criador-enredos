//Store é um armário central onde o app guarda o estado global que precisa ser compartilhada 

const listeners = new Set();

//Estado inicial 
let state = { // guarda os dados atuais nun objeto 
    theme: localStorage.getItem('theme') ?? 'light', //Lé do navegador o thema escolhido
    projectId: null,
};

//O objeto
export const store = { 
    get: () => state,   //Devolve o estado atual 

    //Atualiza o estado so com as partes que mudaram
    set(partial) {
        state = { ...state, ...partial };   //Copia todas as propriedades do estado antigo 
        listeners.forEach((fn) => {
            try { fn(state); } catch (err) { console.error('[store]', err); }
        });
    },

    //Cadastra uma função para ser chamada a cada mudança 
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};

//Aplica tema ao <html> 
document.documentElement.dataset.theme = state.theme;
store.subscribe((s) => {
    document.documentElement.dataset.theme = s.theme;
    localStorage.setItem('theme', s.theme);
});