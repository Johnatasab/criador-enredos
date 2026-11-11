//Transforma erros em feedback ao utilizador
//OBS: toast é aquela caixa que aparece por alguns segundos num canto da tela e some sozinha

//Tratador padrão de erros
export function handleError(error, context = 'Erro') {
    console.error(`[${context}]`, error);
    const message = error?.message ?? String(error);
    showToast(`${context}: ${message}`, 'error');
}

export function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');    //Cria uma nova <div>, ainda solta
    toast.className = `toast toast--${type}`;   //Define as classes CSS. as crases e o ${...} permite inserir uma variável. toast dá um visual base 
    toast.textContent = message;    //Coloca o texto dentro da caixa
    document.body.appendChild(toast);   //Coloca a caixa na página, no fim do body
    setTimeout(() => toast.remove(), duration); //Agenda uma ação, depois de execultar duration, execulta toast.remove()
}