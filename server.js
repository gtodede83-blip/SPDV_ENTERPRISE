require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.send('SPDV Enterprise Online');
});

// LISTAR PRODUTOS
app.get('/produto/:codigo', async (req,res)=>{

    try{

        console.log("CONSULTANDO PRODUTO:", req.params.codigo);

        const resultado = await pool.query(
            'SELECT * FROM produtos WHERE codigo=$1',
            [req.params.codigo]
        );

        console.log(resultado.rows);

        if(resultado.rows.length === 0){

            return res.status(404).json({
                erro:"Produto não encontrado"
            });

        }

        res.json(resultado.rows[0]);

    }catch(erro){

        console.log("ERRO PRODUTO:");
        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

// CADASTRAR PRODUTO
app.post('/produtos', async (req, res) => {

    try {

        const { codigo, descricao, preco, estoque } = req.body;

        await pool.query(
            `INSERT INTO produtos
            (codigo, descricao, preco, estoque)
            VALUES ($1,$2,$3,$4)`,
            [codigo, descricao, preco, estoque]
        );

        res.json({
            sucesso: true,
            mensagem: "Produto cadastrado com sucesso"
        });

    } catch (erro) {

        console.log("ERRO AO CADASTRAR:", erro);

        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

// EXCLUIR PRODUTO
app.delete('/produtos/:id', async (req, res) => {

    try {

        await pool.query(
            'DELETE FROM produtos WHERE id=$1',
            [req.params.id]
        );

        res.json({
            mensagem: 'Produto excluído'
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao excluir produto'
        });

    }

});

app.post("/venda", async (req, res) => {

    try {

        const { itens, total, pagamento } = req.body;

        console.log("=== NOVA VENDA ===");
        console.log(req.body);

        const venda = await pool.query(
            `
            INSERT INTO vendas
            (data,total,forma_pagamento)
            VALUES
            (NOW(),$1,$2)
            RETURNING id
            `,
            [total, pagamento]
        );

        const idVenda = venda.rows[0].id;

        for (const item of itens) {

            await pool.query(
                `
                INSERT INTO itens_venda
                (
                    venda_id,
                    codigo,
                    descricao,
                    quantidade,
                    valor
                )
                VALUES
                ($1,$2,$3,$4,$5)
                `,
                [
                    idVenda,
                    item.codigo,
                    item.descricao,
                    item.quantidade,
                    item.preco
                ]
            );

            await pool.query(
                `
                UPDATE produtos
                SET estoque = estoque - $1
                WHERE codigo = $2
                `,
                [
                    item.quantidade,
                    item.codigo
                ]
            );

        }

        res.json({
            sucesso: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            erro: err.message
        });

    }

});;
     
app.post('/login', async (req,res)=>{

    try{

        const { login, senha } = req.body;

        const resultado = await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE usuario=$1
            AND senha=$2
            `,
            [login, senha]
        );

        if(resultado.rows.length==0){

            return res.status(401).json({
                erro:"Usuário ou senha inválidos"
            });

        }

        res.json(resultado.rows[0]);

    }catch(erro){

        console.log(erro);

        res.status(500).json({
            erro:"Erro no login"
        });

    }

});

app.post('/entrada', async (req,res)=>{

    try{

        const {codigo, quantidade} = req.body;

        await pool.query(
            `
            UPDATE produtos
            SET estoque = estoque + $1
            WHERE codigo = $2
            `,
            [quantidade,codigo]
        );

        res.json({
            sucesso:true
        });

    }catch(erro){

        console.log(erro);

        res.status(500).json({
            erro:erro.message
        });

    }

});

// CADASTRAR CLIENTE
app.post('/clientes', async (req, res)=>{

    try{

        const {
            codigo,
            nome,
            cpf,
            telefone,
            email,
            cidade,
            bairro,
            limite,
            observacao
        } = req.body;

        await pool.query(

            `
            INSERT INTO clientes
            (
                codigo,
                nome,
                cpf,
                telefone,
                email,
                cidade,
                bairro,
                limite,
                observacao
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `,

            [
                codigo,
                nome,
                cpf,
                telefone,
                email,
                cidade,
                bairro,
                limite,
                observacao
            ]

        );

        res.json({
            sucesso:true
        });

    }
    catch(erro){

        console.log(erro);

        res.status(500).json({
            erro:erro.message
        });

    }

});

// LISTAR CLIENTES
app.get('/clientes', async(req,res)=>{

    try{

        const resultado =
        await pool.query(
            `
            SELECT *
            FROM clientes
            ORDER BY nome
            `
        );

        res.json(resultado.rows);

    }
    catch(erro){

        console.log(erro);

        res.status(500).json({
            erro:erro.message
        });

    }

});

// EXCLUIR CLIENTE
app.delete('/clientes/:id', async(req,res)=>{

    try{

        await pool.query(

            `
            DELETE FROM clientes
            WHERE id=$1
            `,

            [req.params.id]

        );

        res.json({
            sucesso:true
        });

    }
    catch(erro){

        console.log(erro);

        res.status(500).json({
            erro:erro.message
        });

    }

});

app.get("/estoque", async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                id,
                codigo,
                descricao,
                preco,
                estoque,
                (estoque * preco) AS valor_total
            FROM produtos
            ORDER BY descricao
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.log("ERRO ESTOQUE:");
        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

app.get("/dashboard", async (req, res) => {

    try {

        const produtos = await pool.query(
            "SELECT COUNT(*) FROM produtos"
        );

        const clientes = await pool.query(
            "SELECT COUNT(*) FROM clientes"
        );

        const estoque = await pool.query(
            "SELECT COALESCE(SUM(estoque),0) total FROM produtos"
        );

        const vendasHoje = await pool.query(`
            SELECT COALESCE(SUM(total),0) total
            FROM vendas
            WHERE DATE(data)=CURRENT_DATE
        `);

        const ultimas = await pool.query(`
        SELECT
        data,
        total,
        forma_pagamento
        FROM vendas
        ORDER BY id DESC
        LIMIT 10
        `);

        res.json({

            produtos: produtos.rows[0].count,
            clientes: clientes.rows[0].count,
            estoque: estoque.rows[0].total,
            vendasHoje: vendasHoje.rows[0].total,
            ultimas: ultimas.rows

        });

    } catch (e) {

        res.status(500).json({
            erro: e.message
        });

    }

});

// ===============================
// RELATÓRIO DE VENDAS
// ===============================

app.get("/relatorios/vendas", async(req,res)=>{

    try{

        const vendas = await pool.query(`

            SELECT

                id,
                data,
                total,
                forma_pagamento

            FROM vendas

            ORDER BY id DESC

        `);

        res.json(vendas.rows);

    }

    catch(err){

        res.status(500).json({
            erro:err.message
        });

    }

});

// APAGAR VENDA
app.delete("/vendas/:id", async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const idVenda = req.params.id;

        // Busca os itens da venda
        const itens = await client.query(
            `
            SELECT
                codigo,
                quantidade
            FROM itens_venda
            WHERE venda_id = $1
            `,
            [idVenda]
        );

        // Devolve o estoque
        for (const item of itens.rows) {

            await client.query(
                `
                UPDATE produtos
                SET estoque = estoque + $1
                WHERE codigo = $2
                `,
                [
                    item.quantidade,
                    item.codigo
                ]
            );

        }

        // Exclui os itens
        await client.query(
            `
            DELETE FROM itens_venda
            WHERE venda_id = $1
            `,
            [idVenda]
        );

        // Exclui a venda
        await client.query(
            `
            DELETE FROM vendas
            WHERE id = $1
            `,
            [idVenda]
        );

        await client.query("COMMIT");

        res.json({
            sucesso: true,
            mensagem: "Venda cancelada com sucesso."
        });

    } catch (erro) {

        await client.query("ROLLBACK");

        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    } finally {

        client.release();

    }

});

// REDEFINIR SENHA
app.put('/usuarios/:id/senha', async (req, res) => {

    try {

        const { senha } = req.body;

        await pool.query(
            `
            UPDATE usuarios
            SET senha = $1
            WHERE id = $2
            `,
            [senha, req.params.id]
        );

        res.json({
            sucesso: true,
            mensagem: "Senha redefinida com sucesso."
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');

});