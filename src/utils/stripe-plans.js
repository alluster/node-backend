// stripe-plans.js

export const stripePricingPlans = [
	{
		priceTitle: 'Starter Plan',
		priceDescription: 'Best option for personal use & for your next project.',
		link:
			process.env.ENVIRONMENT === 'development'
				? 'https://buy.stripe.com/test_3cs2aC2z3crg4HScMM'
				: 'https://buy.stripe.com/live_xxx',
		priceId:
			process.env.ENVIRONMENT === 'development'
				? 'price_1P9RCzDbLsTEfXvIXhAb9lxL'
				: 'price_live_xxx',
		price: 9.99,
		duration: '/year',
		pricePerks: [
			{ title: 'Authentication and user profile' },
			{ title: 'Create integration to Google' },
			{ title: 'AI platform in use: ChatGPT' },
			{ title: 'Dashboards: 1' },
			{ title: 'Teams: 1' },
			{ title: 'Team users: 1' },
			{ title: 'Premium support' },
			{ title: 'Free updates' }
		]
	},
	{
		priceTitle: 'Team Plan',
		priceDescription: 'Best option for a small team or organisation.',
		link:
			process.env.ENVIRONMENT === 'development'
				? 'https://buy.stripe.com/test_3cs2aC2z3crg4HScMM'
				: 'https://buy.stripe.com/live_xxx',
		priceId:
			process.env.ENVIRONMENT === 'development'
				? 'price_1P9RCzDbLsTEfXvIXhAb9lxL'
				: 'price_live_xxx',
		price: 39.99,
		duration: '/year',
		pricePerks: [
			{ title: 'Authentication and user profile' },
			{ title: 'Create integration to Google' },
			{ title: 'AI platform in use: ChatGPT' },
			{ title: 'Dashboards: 10' },
			{ title: 'Teams: 1' },
			{ title: 'Team users: 3' },
			{ title: 'Premium support' },
			{ title: 'Free updates' }
		]
	},
	{
		priceTitle: 'Large Team Plan',
		priceDescription: 'Best option for a small team or organisation.',
		link:
			process.env.ENVIRONMENT === 'development'
				? 'https://buy.stripe.com/test_3cs2aC2z3crg4HScMM'
				: 'https://buy.stripe.com/live_xxx',
		priceId:
			process.env.ENVIRONMENT === 'development'
				? 'price_1P9RCzDbLsTEfXvIXhAb9lxL'
				: 'price_live_xxx',
		price: 1199.99,
		duration: '/year',
		pricePerks: [
			{ title: 'Authentication and user profile' },
			{ title: 'Create integration to Google + custom APIs' },
			{ title: 'AI platform in use: Custom AI for maximum security' },
			{ title: 'Dashboards: +10' },
			{ title: 'Teams: +10' },
			{ title: 'Team users: +10' },
			{ title: 'Premium support' },
			{ title: 'Free updates' }
		]
	}
];
