//Este é o roteador do app, ele decide qual página deve ser exibida com base na URL e no estado de autenticação do usuário. Ele também permite que páginas definam "guards" que podem impedir a navegação para certas rotas.

//Lista as rotas (cada uma com um padrão e uma função que desenha a página)
const routes = [];

//Lista de segurança que roda antes de mostrar qualquer tela (Ex: só entra se estiver logado)
const guards = [];

//Guarda a função de limpeza da tela atual
let activeCleanup = null;

//Evita iniciar o roteador mais de uma vez
let started = false;

//location.hash devolve #/enredos; o .slice(1) remove o # inicial
//|| '/' → se ficar vazio, usa / (página inicial)
//A segunda linha garante que o caminho sempre comece com /
function parseHash() {
    const raw = location.hash.slice(1) || '/';
    return raw.startsWith('/') ? raw : '/' + raw;
}

//Compara um padrão de rota com um caminho real, devolvendo os parâmetros se houver correspondência, ou null se não houver.
function matchPattern(pattern, path) {
    const patternParts = pattern.slice(1).split('/');
    const pathParts = path.slice(1).split('/');
    if (patternParts.length !== pathParts.length) return null;

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
        const p = patternParts[i];
        const v = pathParts[i];
        if (p.startsWith(':')) {
            params[p.slice(1)] = decodeURIComponent(v);
        } else if (p !== v) {
            return null;
        }
    }
    return params;
}

function findMatch(path) {
    for (const route of routes) {
        const params = matchPattern(route.pattern, path);
        if (params) return { route, params };
    }
    return null;
}

async function run() {
    const path = parseHash(); //pega o caminho atual da URL. É o mesmo do (path)

    //1. Guards
    for (const guard of guards) {
        const redirect = await guard(path);
        if (redirect && redirect !== path) {
            location.hash = redirect;
            return; //Sai do run() e espera a próxima mudança de hash
        }
    }

    //2. Match 
    const match = findMatch(path); //Procura uma rota que combine com o caminho atual
    //Se não encontrou nehuma rota, redireciona para a primeira rota da lista (ou para / se não houver nenhuma)
    if (!match) { 
        if (routes.length > 0) {
            location.hash = routes[0].pattern
        }
        return; //Sai do run() e espera a próxima mudança de hash
    }

    //3. Cleanup do view anterior
    if (activeCleanup) {
        try { activeCleanup(); } catch (err) { console.error('[cleanup]', err); }
        //Limpa a função de limpeza da tela anterior, para que ela não seja chamada novamente
        activeCleanup = null;
    }

    const root = document.getElementById('app');//Pega o elemento raiz da tela (onde a página será desenhada)
    if (root) root.innerHTML = ''; //Limpa a tela antes de desenhar a nova página

    //4. Executa o handler
    try {
        //match veio do findMatch ({ route, params })
        //match.route.handler é a função da rota encontrada
        //match.params é o objeto extraído pelo matchPattern (por exemplo { id: "42" })
        const result = await match.route.handler(match.params);       
        
        if (typeof result === 'function') activeCleanup = result;
    } catch (err) { //mostra um erro na tela se a função da rota falhar
        console.error('[router]', err);
        if (root) {
            root.innerHTML = '';
            const box = document.createElement('div');
            box.className = 'view-error';
            box.innerHTML = `<h2>Algo deu errado</h2><p>${err.message ?? err}</p>`;
            root.appendChild(box);
        }
    }
}

//Intarface pública do roteador, expõe so o que o app precisa usar.
export const router = {
    register(pattern, handler) {
        routes.push({ pattern, handler });
    },

    guard(fn) {
        guards.push(fn);
    },

    start() {
        if (started) return;
        started = true;
        window.addEventListener('hashchange', run);
        if (!location.hash) {
            location.hash = routes[0]?.pattern ?? '/';
        } else {
            run();
        }
    },

    run,
};