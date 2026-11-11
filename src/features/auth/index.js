//Tela de login

import { el, mount } from '../../core/dom.js';
import { auth } from '../../core/auth.js';
import { handleError } from '../../core/errors.js';

export function mountAuth() {
    const root = document.getElementById('app');    //Achar a área do app pega <div id="app">

    //Monta a tela com el 
    const view = el('div', { class: 'auth-view' }, [
        el('div', { class: 'auth-card' }, [
            el('h1', { class: 'auth-card__title' }, 'Criador de Enredos'),
            el('p', { class: 'auth-card__subtitle' }, 'Planeia a tua história, personagem a personagem'),
            el('button', {
                class: 'btn btn--primary btn--block',
                type: 'button',
                onclick: onSignIn,
            }, 'Entrar com Google'),
        ]),
    ]);

    //Coloca na tela
    mount(root, view);
}

//Chama o login com Google 
async function onSignIn() {
    try {
        await auth.signInWithGoogle();
    } catch (err) {
        handleError(err, 'Login');
    }
}