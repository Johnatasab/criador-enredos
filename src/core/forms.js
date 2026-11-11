//readForm lê os campos preenchidos e withLoading bloqueia o botão enquanto algo esta processando

export function readForm(formEl) {
    const data = new FormData(formEl);  //new FormData(formEl) pega um <form> e coleta o valor de todos os campos que têm o atributo name
    return Object.fromEntries(data);    //converte esses pares em um objeto comum
}

export async function withLoading(submitBtn, fn, loadingText = 'A processar...') {
    const original = submitBtn?.txtContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.txtContent = loadingText;
    }
    try {
        return await fn();
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.txtContent = original;
        }
    }
}