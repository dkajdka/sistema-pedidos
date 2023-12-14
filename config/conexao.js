const conexao = function () {
    const mysql = require('mysql');

    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'magazine'
    });
}

module.exports = conexao