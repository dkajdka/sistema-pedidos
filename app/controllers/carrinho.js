module.exports.adicionar = async function (app, req, response) {
    const idProduto = req.params.idProduto;
    const idUsuario = req.session.id_usuario;

    const conexao = app.config.conexao;
    const modelPedido = new app.app.models.modelPedido(conexao);
    const modelProdutoPedido = new app.app.models.modelProdutoPedido(conexao);

    //verifica se existe um pedido aberto
    const existePedidoAberto = await modelPedido.existePedidoAberto(idUsuario)

    if (!existePedidoAberto) {
        //cria um pedido
        await modelPedido.criarPedido(idUsuario);
    }

    //pega o id do pedido aberto
    const idPedido = await modelPedido.getIdPedidoAberto(idUsuario);

    //salva o id do pedido aberto em sessão
    req.session.id_pedido = idPedido;

    //verifica se o produto já foi adicionado no pedido aberto
    const existeProduto = await modelProdutoPedido.existeProduto(idProduto, idPedido)

    if (existeProduto) {
        await modelProdutoPedido.alterarQuantidade(idProduto, idPedido)
    }
    else {
        await modelProdutoPedido.inserirProduto(idProduto, idPedido)
    }

    response.redirect('/produtos');
}

module.exports.listar_produtos_pedido = async function (app, req, res) {
    const conexao = app.config.conexao;
    const modelProdutoPedido = new app.app.models.modelProdutoPedido(conexao);
    const modelProduto = new app.app.models.modelProduto(conexao);

    if (!req.session.id_pedido) {
        const erros = [{msg: 'Seu carrinho está vazio!'}];
        res.render('produto/carrinho', {erros: erros, produtos_pedido: [], valorTotal: 0});
        return;
    }

    const idPedido = req.session.id_pedido;

    let produtos_pedido = await modelProdutoPedido.getProdutosPedido(idPedido);
    let valorTotal = 0;

    for (let i = 0; i < produtos_pedido.length; i++) {
        const produto = await modelProduto.getProduto(produtos_pedido[i].id_produto);

        produtos_pedido[i].descricao = produto.descricao;
        produtos_pedido[i].preco = produto.preco;

        valorTotal += produtos_pedido[i].quantidade * produto.preco;
    }

    res.render('produto/carrinho', {erros: {}, produtos_pedido: produtos_pedido, valorTotal: valorTotal})
}