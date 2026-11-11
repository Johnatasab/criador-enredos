//Ponto de entrada
import { auth } from './core/auth.js';
import { router } from './core/router.js';
import { ROUTES, to } from './config/routes.js';
import { handleError } from './core/errors.js';

async function boot() {
    //1. Inicializa auth (pergunta ao Supabase se já existe uma sessão, o await espera a resposta antes de continuar)
    try {
        await auth.init();
    } catch (err) {
        handleError(err, 'Inicialização');
    }

    //2. Guards: protege rotas
    router.guard((path) => {
        const logged = Boolean(auth.current);   //converte o usuário em true(se existe) ou false (null)
        if (!logged && path !== ROUTES.LOGIN) return to.login();    //Não esta logado devolve endereço de login
        if (logged && path === ROUTES.LOGIN) return to.projetos();  //Logado devolve endereço do projeto
        return 
    });

    //3. Registar rotas
    router.register(ROUTES.LOGIN, async () => {
        const { mountAuth } = await import('./features/auth/index.js');
        return mountAuth();
    });

    router.register(ROUTES.PROJETOS, async () => {
        const { mountProjetos } = await import('./features/projetos/index.js');
        return mountProjetos();
    });

    //4. Reage a mudança de auth (login/logout) - re-avalia rota atual
    auth.onChange(() => router.run());

    //5. Arranca
    router.start();
}

boot();