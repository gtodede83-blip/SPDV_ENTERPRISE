// ==========================
// SPDV ENTERPRISE
// layout.js
// Carrega o menu automaticamente
// ==========================

document.addEventListener("DOMContentLoaded", async () => {

    const menu = document.getElementById("menu");

    if (!menu) return;

    try {

        const resposta = await fetch("menu.html");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar menu.html");
        }

        const html = await resposta.text();

        menu.innerHTML = html;

    } catch (erro) {

        console.error("Erro ao carregar o menu:", erro);

    }

});

window.onload = function () {

    fetch("menu.html")
.then(r=>r.text())
.then(html=>{
    document.getElementById("menuLateral").innerHTML = html;
});

}