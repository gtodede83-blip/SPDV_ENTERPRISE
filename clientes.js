// SPDV ENTERPRISE - CLIENTES

// SALVAR CLIENTE
async function salvarCliente(){

    let codigo = document.getElementById("codigo").value;
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let email = document.getElementById("email").value;
    let cidade = document.getElementById("cidade").value;
    let bairro = document.getElementById("bairro").value;
    let limite = document.getElementById("limite").value;
    let observacao = document.getElementById("observacao").value;

    if(codigo=="" || nome==""){
        alert("Preencha Código e Nome!");
        return;
    }

    try{

        await fetch(
            "http://localhost:3000/clientes",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    codigo,
                    nome,
                    cpf,
                    telefone,
                    email,
                    cidade,
                    bairro,
                    limite,
                    observacao

                })

            }
        );

        alert("Cliente cadastrado com sucesso!");

        limparCampos();

        listarClientes();

    }
    catch(erro){

        console.log(erro);

        alert("Erro ao cadastrar cliente");

    }

}


// LISTAR CLIENTES
async function listarClientes(){

    try{

        let resposta =
        await fetch(
            "http://localhost:3000/clientes"
        );

        let clientes =
        await resposta.json();

        let tabela = "";

        clientes.forEach((c)=>{

            tabela += `
            <tr>

            <td>${c.codigo}</td>

            <td>${c.nome}</td>

            <td>${c.cpf}</td>

            <td>${c.telefone}</td>

            <td>R$ ${Number(c.limite).toFixed(2)}</td>

            <td>

            <button
            onclick="excluirCliente(${c.id})"
            style="
            background:red;
            color:white;
            border:none;
            padding:8px;
            border-radius:5px;
            cursor:pointer">

            EXCLUIR

            </button>

            </td>

            </tr>
            `;

        });

        document.getElementById("listaClientes").innerHTML =
        tabela;

    }
    catch(erro){

        console.log(erro);

    }

}


// EXCLUIR CLIENTE
async function excluirCliente(id){

    if(!confirm("Deseja excluir este cliente?")){
        return;
    }

    try{

        await fetch(

            `http://localhost:3000/clientes/${id}`,

            {
                method:"DELETE"
            }

        );

        listarClientes();

    }
    catch(erro){

        console.log(erro);

    }

}


// LIMPAR CAMPOS
function limparCampos(){

    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("limite").value = "";
    document.getElementById("observacao").value = "";

    document.getElementById("codigo").focus();

}


// CARREGA CLIENTES AO ABRIR A TELA
listarClientes();