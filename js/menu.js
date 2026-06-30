// =========================
// SPDV ENTERPRISE
// MENU.JS
// =========================

// Abrir / Fechar Menu
function toggleMenu() {

    const menu = document.getElementById("menuLateral");

    if (!menu) return;

    menu.classList.toggle("ativo");

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

    if(e.key === "Escape"){

        const menu = document.getElementById("menuLateral");

        if(menu){
            menu.classList.remove("ativo");
        }

    }

});

// Destacar página atual
document.addEventListener("DOMContentLoaded", function(){

    const pagina = window.location.pathname.split("/").pop();

    document.querySelectorAll("#menuLateral a").forEach(link=>{

        if(link.getAttribute("href") === pagina){

            link.classList.add("ativo");

        }

    });

});