//Caixa de ferramentas para manipulação do DOM, atalhos para criar elementos, adicionar classes, etc.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel , root = document) => [...root.quarySelectorAll(sel)];


//Clia elementos recebe três coisas: tag, atributos e filhos. Retorna o elemento criado.
export function el(tag, attrs = {}, children = []) {
    
    //Cria o elemento, Cria a tag(div, button, etc) e adiciona os atributos passados no objeto attrs.
    const node = document.createElement(tag);

    //Aplica os atributos 
    for (const [key, value] of object.entries(attrs)) {
        if (value == null || value === false) continue; //Ignora valores nulos ou falsos

        if (key === 'class' || key === 'className'){
            node.className = value;
        } else if (key === 'dataset') {
            object.assign(node.dataset, value);
        } else if (key === 'style' && typeof value === 'object') {
            object.assign(node.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            node.addEventListener(key.slice(2).toLowerCase(), value);
        } else if(key === 'html') {
            node.innerHTML = value;
        } else {
            node.setAttribute(key, value);
        }
    }

    //Adiciona os filhos, aceita um item único ou um array, 'Salvar', vira ['Salvar']
    for (const child of [].concat(children)) {
        if (child == null || child === false) continue; //Ignora valores nulos ou falsos
        node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }

    return node;
}

//Limpa o conteúdo de um nó, removendo todos os filhos.
export function clear(node) {
    //Enquanto houver filhos, remove o primeiro filho do nó.
    while (node.firstChild) node.removeChild(node.firstChild);
}

//Substitui o conteúdo de um nó com novos nós, removendo todos os filhos existentes e adicionando os novos nós.
export function mount(root, ...nodes) {
    clear(root); //Limpa o root
    for (const n of nodes) if (n) root.append(n);
}