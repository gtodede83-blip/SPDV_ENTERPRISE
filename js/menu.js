// =========================
// SPDV ENTERPRISE
// MENU.JS
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const menu = document.getElementById("menuLateral");

    if (!menu) return;

    menu.innerHTML = `
        <div class="logo">
            <h2>SPDV</h2>
            <small>Enterprise</small>
        </div>

        <a href="dashboard.html">🏠 Dashboard</a>
        <a href="vendas.html">💰 Vendas</a>
        <a href="produtos.html">📦 Produtos</a>
        <a href="clientes.html">👥 Clientes</a>
        <a href="estoque.html">📋 Estoque</a>
        <a href="relatorios.html">📊 Relatórios</a>
        <a href="usuarios.html">👤 Usuários</a>
        <a href="configuracoes.html">⚙ Configurações</a>
    `;

    const pagina = window.location.pathname.split("/").pop();

    menu.querySelectorAll("a").forEach(link => {

        if (link.getAttribute("href") === pagina) {
            link.classList.add("ativo");
        }

    });

});

// Abrir / Fechar
function toggleMenu() {

    const menu = document.getElementById("menuLateral");

    if (menu) {
        menu.classList.toggle("ativo");
    }

}

// Fechar clicando fora
document.addEventListener("click", function(e){

    const menu = document.getElementById("menuLateral");
    const botao = document.getElementById("btnMenu");

    if(!menu || !botao) return;

    if(
        !menu.contains(e.target) &&
        !botao.contains(e.target)
    ){
        menu.classList.remove("ativo");
    }

});

// Fechar com ESC
document.addEventListener("keydown", function(e){

    if(e.key==="Escape"){

        const menu=document.getElementById("menuLateral");

        if(menu){
            menu.classList.remove("ativo");
        }

    }

});