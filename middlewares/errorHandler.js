function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'JSON inválido na requisição'
        });
    }

    if (err.status === 400) {
        return res.status(400).json({
            error: err.message || 'Requisição inválida'
        });
    }

    const status = err.status || 500;

    res.status(status).json({
        error: err.message || 'Erro interno do servidor'
    });
}

module.exports = errorHandler;