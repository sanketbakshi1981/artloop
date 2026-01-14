module.exports = async function (context, req) {
    context.log('Create Payment Intent function triggered');

    // Enable CORS
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle preflight
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    if (req.method !== 'POST') {
        context.res.status = 405;
        context.res.body = { error: 'Method not allowed' };
        return;
    }

    try {
        // Get Stripe secret key from environment variables
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        
        if (!stripeSecretKey) {
            context.log.error('❌ STRIPE_SECRET_KEY not configured in environment variables');
            context.res.status = 500;
            context.res.body = { 
                error: 'Payment provider not configured',
                details: 'Stripe secret key is missing. Please configure STRIPE_SECRET_KEY in your Azure Function App settings.'
            };
            return;
        }

        // Initialize Stripe
        const stripe = require('stripe')(stripeSecretKey);

        // Extract request data
        const { amount, eventTitle, ticketQuantity, customerEmail } = req.body;

        // Validate inputs
        if (!amount || amount <= 0) {
            context.res.status = 400;
            context.res.body = { error: 'Invalid amount' };
            return;
        }

        // Convert amount to cents (Stripe expects amounts in smallest currency unit)
        const amountInCents = Math.round(amount * 100);

        context.log(`Creating payment intent for $${amount} (${amountInCents} cents)`);

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            description: `${eventTitle} - ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`,
            metadata: {
                eventTitle,
                ticketQuantity: ticketQuantity.toString(),
                customerEmail: customerEmail || 'not_provided',
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        context.log('✅ Payment intent created successfully:', paymentIntent.id);

        // Return client secret
        context.res.status = 200;
        context.res.body = {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };

    } catch (error) {
        context.log.error('❌ Error creating payment intent:', error);
        context.res.status = 500;
        context.res.body = {
            error: 'Failed to create payment intent',
            details: error.message
        };
    }
};
