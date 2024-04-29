import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY);


export const CreteCustomer = async ({ email }) => {
	try {
		const customer = await stripe.customers.create({
			email: email,
		});

		console.log(customer.id);
	}
	catch (err) {
		console.log(err)
	}
}

export const GetCustomer = async ({ id }) => {
	try {
		const cus = await stripe.customers.retrieve(`${id}`);
		console.log(cus);
	}
	catch (err) {
		console.log(err)
	}
}


