const paypal = require('@paypal/checkout-server-sdk');
const conn = require('../config/db');
const firebase = require('../config/firebase');

const startPayment = async (req, res) => {
    const { user_token, amount, currency, item } = req.query;

    if (!user_token || !amount || !item || !currency) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: currency.toString(),
                value: amount.toString()
            },
            application_context: {
                success_url: `${req.protocol}://${req.get('host')}/api/payment/success`,
                cancel_url: `${req.protocol}://${req.get('host')}/api/payment/cancel`
            },
            description: item.toString()
        }]
    });

    try {
        const order = await client().execute(request);

        const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
        const paymentData = {
            user_token: user_token.toString(),
            paypal_transaction_id: order.result.id,
            item: item.toString(),
            amount: amount.toString(),
            currency: currency.toString(),
            status: 'Created',
            payment_date: new Date(),
            payer_email: null,
            response_data: JSON.stringify(order),
            created_at: new Date(),
            updated_at: new Date()
        };
        const sql = `INSERT INTO payments SET ?`;
        const [ result ] = await conn.query(sql, paymentData);
        if(result) {
            return res.status(200).json({ approvalUrl });
        } else {   
            return res.status(500).json({ error: 'Failed to create Order' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
};

const paymentSuccess = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(token);

    try {
        const capture = await client().execute(request);

        const paymentData = {
            status: 'Completed',
            payer_email: capture.result.payer.email_address,
            updated_at: new Date(),
            response_data: JSON.stringify(capture)
        };

        const updateSql = "UPDATE payments SET ? WHERE paypal_transaction_id = ?";
        const [updateResult] = await conn.query(updateSql, [paymentData, token]);

        if (updateResult.affectedRows > 0) {

            const getTokenSql = "SELECT user_token, amount, status, paypal_transaction_id,item FROM payments WHERE paypal_transaction_id = ?";
            const [firebaseData] = await conn.query(getTokenSql, [token]);

            if (firebaseData.length > 0) {
                const { user_token, amount, status, paypal_transaction_id, item } = firebaseData[0];


                const paymentDataToStore = {
                    amount,
                    status,
                    timestamp: new Date(),
                    paypal_transaction_id,
                    item
                };

                const firebaseRef = firebase.ref(`users/${user_token}/payments/${paypal_transaction_id}`);

                firebaseRef.set(paymentDataToStore)
                    .then(() => {
                        return res.status(200).json({ message: 'Payment data stored in Firebase successfully' });
                    })
                    .catch((firebaseErr) => {
                        return res.status(500).json({ error: `Firebase Error: ${firebaseErr.message}` });
                    });
            } else {
                return res.status(404).json({ error: 'Payment record not found' });
            }
        } else {
            return res.status(500).json({ error: 'Failed to update payment status' });
        }
    } catch (err) {
        console.error('PayPal Capture Error:', err.message);
        return res.status(500).json({ error: 'Failed to capture PayPal payment' });
    }
};


const paymentCancel = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Missing token for cancellation' });
    }

    const paymentData = {
        status: 'Cancelled',
        updated_at: new Date()
    };

    const sql = "UPDATE payments SET ? WHERE paypal_transaction_id = ?";
    conn.query(sql, [paymentData, token], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update payment status in the database' });
        }
        res.send('Payment was successfully cancelled.');
    });
};

module.exports = {
    startPayment,
    paymentSuccess,
    paymentCancel
};

// PayPal Environment Setup
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const client = () => new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment(clientId, clientSecret));

