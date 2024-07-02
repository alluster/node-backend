
import express from 'express';
import dotenv from 'dotenv'; dotenv.config();
import { notFound, errorHandler } from './src/utils/error_middlewares.js';
import helmet from 'helmet';
import morgan from 'morgan';
import api from './src/api/index.js';
import { message } from './src/constants/apiMessage.js';
import cors from 'cors';
import { validateUser } from './src/api/auth/auth.middlewares.js';
import bodyParser from 'body-parser';
import stripeRoutes from './src/api/stripe/stripe.routes.js'

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use('/api/v1/stripe', stripeRoutes); // Stripe routes detached from router to prevent altering response sent to stripe

app.use(express.json())
app.use(cors());
app.use(validateUser)
// app.use(bodyParser.raw({ type: '*/*' }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
	res.json({ message: message })
})
app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);


export default app;