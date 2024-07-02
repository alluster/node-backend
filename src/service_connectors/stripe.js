import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY);

export const GetStripeCustomer = async ({ id }) => {
	try {
		const customer = await stripe.customers.retrieve(id);
		return { data: customer, message: 'Customer data retrieved successfully' };
	} catch (error) {
		console.error('Failed to retrieve customer data:', error);
		return { data: null, message: 'Failed to retrieve customer data', error: error.message };
	}
};


export const CreateStripeCustomer = async ({ email }) => {
	try {
		const customer = await stripe.customers.create({ email });
		return { id: customer.id, message: 'Customer created successfully' };
	} catch (error) {
		console.error('Failed to create customer:', error);
		return { data: null, message: 'Failed to create customer in stripe', error: error.message };
	}
};
