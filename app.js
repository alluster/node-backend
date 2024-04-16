
const express = require('express');
const dotenv = require('dotenv'); dotenv.config();
const error_middlewares = require('./src/utils/error_middlewares');
const pool = require('./src/utils/pool');
const helmet = require('helmet');
const morgan = require('morgan')
const api = require('./src/api');
const apiMessage = require('./src/constants/apiMessage');
const cors = require('cors');
const authMiddlewares = require('./src/api/auth/auth.middlewares');
const { GoogleAnalytics } = require('./src/service_connectors/google');

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json())
app.use(cors());
app.use(authMiddlewares.validateUser)

app.get('/', (req, res) => {
	res.json({ message: apiMessage.message })
})

app.use('/api/v1', api);

app.use(error_middlewares.notFound);
app.use(error_middlewares.errorHandler);






module.exports = app;