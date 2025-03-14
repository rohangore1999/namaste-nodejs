const express = require('express');
const paymentRouter = express.Router();
const bodyParser = require('body-parser');

// Utils
const Cashfree = require('../utils/cashfree');

// Middleware
const { userAuth } = require('../middlewares/auth');

// Model
const Payment = require('../models/payment');
const User = require('../models/user');

const MEMBERSHIP_TYPES = {
  gold: 100,
  silver: 50,
};

paymentRouter.post('/payment/create-order', userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { membershipType } = req.body;

    const request = {
      order_amount: MEMBERSHIP_TYPES[membershipType],
      order_currency: 'INR',
      customer_details: {
        customer_id: req?.user?._id,
        customer_name: firstName + ' ' + lastName,
        customer_email: emailId,
        customer_phone: '9999999999',
      },
      order_meta: {
        return_url: 'http://3.108.59.63/payment-status?orderId={order_id}',
      },
    };

    const order = await Cashfree.PGCreateOrder('2023-08-01', request);

    console.log(req.user);

    const payment = new Payment({
      userId: req?.user?._id, // from userAuth middleware
      orderId: order?.data?.order_id,
      orderAmount: order?.data?.order_amount,
      orderCurrency: order?.data?.order_currency,
      customerDetails: order?.data?.customer_details,
      orderMeta: order?.data?.order_meta,
      orderStatus: order?.data?.order_status,
    });

    const savePayment = await payment.save();

    console.log(savePayment.toJSON());

    // res.json({ ...savePayment.toJSON() });
    res.json(order.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// webhook from Cashfree when payment is successful.
// ref: https://www.cashfree.com/docs/payments/online/webhooks/overview#webhook-signature-verification
// https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks
// no need of userAuth middleware here because Cashfree will send the request.
paymentRouter.post(
  '/payment/webhook',
  bodyParser.raw({ type: '*/*' }), // Use raw parser for all content types
  async (req, res) => {
    try {
      console.log('req.body in /webhook >>> ', req.body); // req.body will be Buffer

      const rawBody = req.body.toString(); // Convert Buffer to string
      console.log('rawBody in /webhook >>> ', rawBody); // This is the raw body as a string

      const signature = req.headers['x-webhook-signature'];
      const timestamp = req.headers['x-webhook-timestamp'];

      // Use rawBody for signature verification
      const isVerified = Cashfree.PGVerifyWebhookSignature(
        signature,
        rawBody, // Pass the raw body string here
        timestamp
      );

      if (!isVerified) {
        throw new Error('Webhook Signature Verification Failed');
      }

      console.log('Webhook Signature Verification Successful');

      // Parse the raw body (JSON) into an object for further processing
      const parsedBody = JSON.parse(rawBody);
      console.log('parsedBody >>> ', parsedBody);

      // update the payment status in the database

      // finding the payment by orderId(from Cashfree)
      console.log('finding the payment by orderId(from Cashfree) ');

      const payment = await Payment.findOne({
        orderId: parsedBody?.data?.order?.order_id,
      });
      payment.orderStatus = parsedBody?.data?.payment?.payment_status;

      console.log('payment >>> ', payment);

      await payment.save();

      // Updating the User db (as we've used ref: User in payment db)
      console.log("Updating the User db (as we've used ref: User in payment db) ");

      const user = await User.findOne({
        _id: parsedBody?.data?.customer_details?.customer_id,
      }); // as we have stored the userId while /create-order
      user.isPayment = true;

      console.log('user >>> ', user);

      await user.save();

      if (parsedBody.type === 'PAYMENT_SUCCESS_WEBHOOK') {
        console.log('Payment Successful !!');
      } else {
        console.log('Payment Failed !!');
      }

      res.send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
);

paymentRouter.get('/payment/status', userAuth, async (req, res) => {
  // get the userID from userAuth middleware
  // from get the orderId from Payment db based on userId

  // getting the orderid from query param
  const orderId = req?.query?.orderId;

  try {
    console.log('Query Param >>', req?.query);
    console.log({ orderId });

    const response = await Cashfree.PGFetchOrder('2023-08-01', orderId);

    console.log(response?.data);
    // .then((response) => {
    //   console.log("Order fetched successfully:", response.data);
    // })
    // .catch((error) => {
    //   console.error("Error:", error.response.data.message);
    // });

    res.send(response?.data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err?.data?.message);
  }
});

module.exports = paymentRouter;
