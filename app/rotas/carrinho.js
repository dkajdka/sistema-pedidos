module.exports = function (app) {
    app.get('/adicionar/:idProduto', function (req, res) {
        app.app.controllers.produto_pedido.adicionar(app, req, res);
    });

    app.get('/carrinho', function (req, res) {
        app.app.controllers.produto_pedido.listar_produtos_pedido(app, req, res);
    });
}