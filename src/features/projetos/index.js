//Tela de projetos 

import { el, mount } from '../../core/dom.js';
import { auth } from '../../core/auth.js';
import { handleError } from '../../core/errors.js';
import { APP_NAME } from '../../config.js';

export function mountProjetos() {
    const root = document.getElementById('app');
    const user = auth.current;

    const view = el('div', { class: 'projetos-view' }, [
        el('header', { class: 'app-header' }, [
            el('h1', { class: 'app-header__title' }, APP_NAME),
            el('div', { class: 'app-header__right' }, [
                el('span', { class: 'app-header__user' }, user?.email ?? ''),
                el('button', {
                    class: 'btn btn--ghost btn--sm',
                    type: 'button',
                    onclick: onLogout,
                }, 'sair'),
            ]),
        ]),
        el('main', { class: 'app-main' }, [
            el('h2', {}, 'Os teus projetos'),
            el('p', {}, 'Em breve vai poder criar e gerir projetos literários aqui.'),
        ]),
    ]);

    //Limpa a área e coloca a tela
    mount(root, view);
}

async function onLogout() {
    try {
        await auth.signOut();   //Encerra a sessão no supabase e espera terminar
        location.hash = '#/login';  //Leva o usuário para a tela de login
    } catch (err) {
        handleError(err, 'Logout');
    }
}