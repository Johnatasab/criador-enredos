//Catálogo de endereços do app

//Padrões (para registar no router)
export const ROUTES = {
    LOGIN: '/login',
    PROJETOS: '/projetos',
    PROJETO: '/projetos/:id',
};

//Helpers (para navegar, links reais)
export const to = {
    login: () => '#/login',
    projetos: () => '#/projetos',
    projeto: (id) => `#/projetos/${id}`,
};