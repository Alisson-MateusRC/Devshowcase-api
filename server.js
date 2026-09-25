require('dotenv').config();

const express = require('express');
const sequelize = require('./database');

const profileRoutes = require('./routes/profileRoutes');
const technologyRoutes = require('./routes/technologyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const errorHandler = require('./middlewares/errorHandler');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();

app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de Profile
app.use('/api/profiles', profileRoutes);

// Rotas de Technology
app.use('/api/technologies', technologyRoutes);

// Rotas de Project
app.use('/api/projects', projectRoutes);

// Rotas de Feedback
app.use('/api/feedbacks', feedbackRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'DevShowcase API funcionando!'
    });
});

// Tratamento de rotas não encontradas
app.use((req, res, next) => {
    const error = new Error('Rota não encontrada');
    error.status = 404;
    next(error);
});

// Tratamento global de erros
app.use(errorHandler);

const PORT = 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com PostgreSQL realizada com sucesso!');

        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Tabelas sincronizadas com sucesso!');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao iniciar a aplicação:', error.message);
    });