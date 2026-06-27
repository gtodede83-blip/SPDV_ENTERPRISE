// =========================
// SPDV ENTERPRISE
// MENU.JS
// =========================

// Abrir e Fechar Menu
function toggleMenu() {

    const menu = document.getElementById("menuLateral");

    menu.classList.toggle("ativo");

}

// Fechar ao clicar fora
document.addEventListener("click", function (e) {

    const menu = document.getElementById("menuLateral");
    const botao = document.getElementById("btnMenu");

    if (!menu || !botao) return;

    if (!menu.contains(e.target) && !botao.contains(e.target)) {

        menu.classList.remove("ativo");

    }

});

// Fechar com ESC
document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        document
            .getElementById("menuLateral")
            ?.classList.remove("ativo");

    }

});

// Destacar página atual
document.addEventListener("DOMContentLoaded", () => {

    const pagina = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll("#menuLateral a");

    links.forEach(link => {

        if (link.getAttribute("href") === pagina) {

            link.style.background = "#0066cc";
            link.style.fontWeight = "bold";

        }

    });

});

function toggleMenu(){

    document
    .getElementById("menuLateral")
    .classList.toggle("ativo");

}

document.addEventListener("click",(e)=>{

    const menu=document.getElementById("menuLateral");

    const botao=document.getElementById("btnMenu");

    if(!menu) return;

    if(botao){

        if(
            !menu.contains(e.target)
            &&
            !botao.contains(e.target)
        ){

            menu.classList.remove("ativo");

        }

    }

});
