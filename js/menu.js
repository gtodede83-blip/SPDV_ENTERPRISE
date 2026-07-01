// =========================
// SPDV ENTERPRISE
// MENU.JS
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const menu = document.getElementById("menuLateral");

    menu.innerHTML = `
        <div class="menuLateral">

            <div class="logo">
                <h2>SPDV<br><small>Enterprise</small></h2>
            </div>

            <a href="dashboard.html">🏠 Dashboard</a>
            <a href="produtos.html">📦 Produtos</a>
            <a href="clientes.html">👥 Clientes</a>
            <a href="estoque.html">📋 Estoque</a>
            <a href="vendas.html">💰 Vendas</a>
            <a href="usuarios.html">👤 Usuários</a>
            <a href="relatorios.html">📊 Relatórios</a>
            <a href="configuracoes.html">⚙️ Configurações</a>
            <hr>
            <a href="login.html">🚪 Sair</a>

        </div>
    `;

});
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