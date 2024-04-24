import app from './app.js';
import { info } from './src/utils/logger.js';

const port = process.env.PORT || 3000;
app.listen(port, () => {
	info(`Listening at http://localhost:${port}`);
});