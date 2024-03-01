const app = require('./app');
const logger = require('./src/utils/logger');

const port = process.env.PORT || 3000;
app.listen(port, () => {
	logger.info(`Listening at http://localhost:${port}`);
});