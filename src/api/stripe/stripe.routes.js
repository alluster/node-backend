import express from 'express';
import Stripe from 'stripe';
import { stripePricingPlans } from '../../utils/stripe-plans.js';
import db from '../../../db/knex.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SIGNIN_SECRET;

// Middleware to capture raw body for Stripe signature verification


router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

	let event;
	if (endpointSecret) {
		const signature = req.headers['stripe-signature'];
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				endpointSecret
			);
			console.log('⚠️  Webhook signature verification successful.');
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`, err.message);
			return res.sendStatus(400);
		}
	} else {
		event = req.body;
	}

	console.log(event);

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = await stripe.checkout.sessions.retrieve(
					event.data.object.id,
					{ expand: ['line_items'] }
				);

				const customerId = session.customer;
				const customer = await stripe.customers.retrieve(customerId);
				const priceId = session.line_items.data[0].price.id;
				const plan = stripePricingPlans.find((item) => item.priceId === priceId);

				console.log('The plan from stripe.routes:', plan);

				if (!plan) {
					console.error('Plan not found for price ID:', priceId);
					break;
				}

				const updatedUser = await db('user')
					.where({ email: customer.email })
					.update({
						stripe_id: customerId,
						stripe_subscription: true,
						updated_at: new Date()
					});

				if (updatedUser === 0) {
					console.error('User record not found for email:', customer.email);
					return res.status(404).json({ error: 'User record not found' });
				}
				// todo: send email to user
				break;
			}
			case 'checkout.session.deleted': {
				const subscription = await stripe.subscriptions.retrieve(
					data.object.id
				);
				const updatedUser = await db('user')
					.where({ stripe_id: subscription.customer })
					.update({
						stripe_subscription: false,
						updated_at: new Date()
					});

				if (updatedUser === 0) {
					console.error('User record not found for email:', customer.email);
					return res.status(404).json({ error: 'User record not found' });
				}
				break;

			}

			default:
				console.log(`Unhandled event type ${event.type}.`);
		}

		res.status(200).send();
	} catch (error) {
		console.error('Error processing webhook event:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
