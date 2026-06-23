// SPDV ENTERPRISE

let usuario = JSON.parse(localStorage.getItem("usuario"));

if (usuario && document.getElementById("operador")) {
    document.getElementById("operador").innerHTML = usuario.nome;
}

let itens = [];
let total = 0;
let formaPagamento = "";
let produtoAtual = null;

document.addEventListener("DOMContentLoaded", ()=>{

    document.getElementById("pagamentoDinheiro").style.display = "none";

    document.getElementById("valorRecebido").value = "";

    document.getElementById("troco").innerHTML = "Troco: R$ 0,00";

    document.getElementById("nomeProduto").innerHTML =
    "AGUARDANDO PRODUTO...";

    document.getElementById("precoProduto").innerHTML =
    "R$ 0,00";

    document.getElementById("quantidade").value = "1";

    document.getElementById("codigo").focus();

    document.getElementById("quantidade")
    .addEventListener("keydown", function(event){

        if(event.key=="Enter"){
            adicionarProduto();
        }

    });

});

// CONSULTAR PRODUTO
async function consultarProduto(){

    let codigo = document.getElementById("codigo").value;

    if(codigo==""){
        return;
    }

    try{

        let resposta = await fetch(
            `http://localhost:3000/produto/${codigo}`
        );

        if(!resposta.ok){
            return;
        }

        produtoAtual = await resposta.json();

        document.getElementById("nomeProduto").innerHTML =
            produtoAtual.descricao;

        document.getElementById("precoProduto").innerHTML =
            "R$ " + Number(produtoAtual.preco).toFixed(2);

    }catch(erro){

        console.log(erro);

    }

}


// ENTER NO CÓDIGO
function irQuantidade(){

    if(document.getElementById("codigo").value==""){
        return;
    }

    document.getElementById("quantidade").focus();

    document.getElementById("quantidade").select();

}


// ENTER NA QUANTIDADE
document.addEventListener("DOMContentLoaded",()=>{

    document.getElementById("quantidade")
    .addEventListener("keydown",function(event){

        if(event.key=="Enter"){

            adicionarProduto();

        }

    });

});


// ADICIONAR PRODUTO
function adicionarProduto(){

    if(produtoAtual == null){
        return;
    }

    let quantidade =
    parseFloat(document.getElementById("quantidade").value) || 1;

    let totalItem = quantidade * Number(produtoAtual.preco);

    itens.push({

        codigo: produtoAtual.codigo,
        descricao: produtoAtual.descricao,
        quantidade: quantidade,
        preco: Number(produtoAtual.preco),
        total: totalItem

    });

    total += totalItem;

    atualizarTela();

    // Limpa campos
    document.getElementById("codigo").value = "";
    document.getElementById("quantidade").value = "1";

    document.getElementById("nomeProduto").innerHTML =
    "AGUARDANDO PRODUTO...";

    document.getElementById("precoProduto").innerHTML =
    "R$ 0,00";

    produtoAtual = null;

    document.getElementById("codigo").focus();

}

// TABELA
function atualizarTela(){

    let tabela="";

    itens.forEach((p,i)=>{

        tabela += `
        <tr>

        <td>${p.codigo}</td>

        <td>${p.descricao}</td>

        <td>${p.quantidade}</td>

        <td>R$ ${p.preco.toFixed(2)}</td>

        <td>R$ ${p.total.toFixed(2)}</td>

        <td>

        <button
        onclick="removerItem(${i})"
        style="
        background:red;
        color:white;
        border:none;
        padding:8px;
        border-radius:5px;
        cursor:pointer">

        X

        </button>

        </td>

        </tr>
        `;

    });

    document.getElementById("itens").innerHTML = tabela;

    document.getElementById("total").innerHTML =
    "TOTAL: R$ " + total.toFixed(2);

    document.getElementById("qtdItens").innerHTML =
    itens.length;

}


// REMOVER ITEM
function removerItem(i){

    total -= itens[i].total;

    itens.splice(i,1);

    atualizarTela();

}


// PAGAMENTO
function selecionarPagamento(tipo){

    formaPagamento = tipo;

    // Esconde primeiro
    document.getElementById("pagamentoDinheiro").style.display = "none";

    // Só mostra se for dinheiro
    if(tipo == "DINHEIRO"){
        document.getElementById("pagamentoDinheiro").style.display = "block";
    }

}

// FINALIZAR VENDA
async function finalizarVenda(){

    if(itens.length==0){

        alert("Nenhum item na venda!");

        return;

    }

    if(formaPagamento==""){

        alert("Selecione a forma de pagamento!");

        return;

    }

    try{

        await fetch(
            "http://localhost:3000/venda",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    itens,
                    total,
                    pagamento:formaPagamento

                })

            }

        );

try{
    imprimirCupom();
}catch(e){
    console.log("Erro na impressão:", e);
}

        alert("Venda finalizada com sucesso!");

        itens = [];
total = 0;
formaPagamento = "";
produtoAtual = null;

document.getElementById("codigo").value = "";
document.getElementById("quantidade").value = "1";

document.getElementById("nomeProduto").innerHTML =
"AGUARDANDO PRODUTO...";

document.getElementById("precoProduto").innerHTML =
"R$ 0,00";

document.getElementById("valorRecebido").value = "";

document.getElementById("troco").innerHTML =
"Troco: R$ 0,00";

document.getElementById("pagamentoDinheiro").style.display = "none";

atualizarTela();

document.getElementById("codigo").focus();;

    }
    catch(erro){

        console.log(erro);

        alert("Erro ao finalizar venda");

    }

}

function calcularTroco(){

    let recebido =
    Number(
    document.getElementById("valorRecebido").value
    );

    let troco = recebido - total;

    if(troco < 0){

        document.getElementById("troco")
        .innerHTML =
        "Faltam R$ " + Math.abs(troco).toFixed(2);

    }
    else{

        document.getElementById("troco")
        .innerHTML =
        "Troco: R$ " + troco.toFixed(2);

    }

}

function enterFinalizar(event){

    if(event.key=="Enter"){

        if(formaPagamento=="DINHEIRO"){

            let recebido =
            Number(document.getElementById("valorRecebido").value);

            if(recebido < total){

                alert(
                "Valor recebido é menor que o total da venda!"
                );

                return;

            }

        }

        finalizarVenda();

    }

}

function imprimirCupom(){

    let cupom="";

    itens.forEach(p=>{

        cupom += `
        ${p.descricao}<br>
        ${p.quantidade} x R$ ${p.preco.toFixed(2)}
        = R$ ${p.total.toFixed(2)}
        <br><br>
        `;

    });

    document.getElementById("itensCupom").innerHTML = cupom;

    document.getElementById("totalCupom").innerHTML =
    "TOTAL: R$ " + total.toFixed(2);

    document.getElementById("pagamentoCupom").innerHTML =
    "Pagamento: " + formaPagamento;

    let recebido =
    Number(document.getElementById("valorRecebido").value) || total;

    let troco = recebido - total;

    document.getElementById("trocoCupom").innerHTML =
    "Troco: R$ " + troco.toFixed(2);

    let tela = window.open("", "", "width=300,height=700");

tela.document.write(`
<html>
<head>
<title>Cupom</title>

<style>

body{
    width:280px;
    font-family:Courier New;
    font-size:14px;
    margin:5px;
}

.center{
    text-align:center;
}

hr{
    border:none;
    border-top:1px dashed black;
}

.total{
    font-size:18px;
    font-weight:bold;
}

</style>

</head>

<body>

<div class="center">

<h2>SPDV ENTERPRISE</h2>

SUPERMERCADO<br>
CNPJ: 05.101.030/0001-00<br>
CUPOM NÃO FISCAL<br>

${new Date().toLocaleString()}

</div>

<hr>

${cupom}

<hr>

<div class="total">
TOTAL: R$ ${total.toFixed(2)}
</div>

Pagamento: ${formaPagamento}<br>
Recebido: R$ ${recebido.toFixed(2)}<br>
Troco: R$ ${troco.toFixed(2)}

<hr>

Operador: ${usuario.nome}

<hr>

<div class="center">
OBRIGADO PELA PREFERÊNCIA!<br>
VOLTE SEMPREs
</div>

</body>
</html>
`);

tela.document.close();

setTimeout(() => {

    tela.focus();

    tela.print();
s
    setTimeout(() => {
        tela.close();
    }, 1000);

}, 500);

}