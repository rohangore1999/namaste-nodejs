const express = require("express");
const paymentRouter = express.Router();
const bodyParser = require("body-parser");

// Utils
const Cashfree = require("../utils/cashfree");

// Middleware
const { userAuth } = require("../middlewares/auth");

// Model
const Payment = require("../models/payment");

const MEMBERSHIP_TYPES = {
  gold: 100,
  silver: 50,
};

paymentRouter.post("/payment/create-order", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { membershipType } = req.body;

    const request = {
      order_amount: MEMBERSHIP_TYPES[membershipType],
      order_currency: "INR",
      customer_details: {
        customer_id: req?.user?._id,
        customer_name: firstName + " " + lastName,
        customer_email: emailId,
        customer_phone: "9999999999",
      },
      // order_meta: {
      //   return_url:
      //     "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
      // },
    };

    const order = await Cashfree.PGCreateOrder("2023-08-01", request);

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
    res.status(500).send("Internal Server Error");
  }
});

// webhook from Cashfree when payment is successful.
// ref: https://www.cashfree.com/docs/payments/online/webhooks/overview#webhook-signature-verification
// https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks
// no need of userAuth middleware here because Cashfree will send the request.
paymentRouter.post(
  "/payment/webhook",
  bodyParser.raw({ type: "application/json" }), // Change to specifically handle JSON
  async (req, res) => {
    try {
      // Log the request headers for debugging
      console.log("Webhook Headers:", req.headers);

      // Get raw body as Buffer and convert to string
      const rawBody = req.body;
      const bodyString = rawBody.toString("utf8");
      console.log("rawBody type:", typeof rawBody);
      console.log("rawBody in /webhook >>> ", bodyString);

      const signature = req.headers["x-webhook-signature"];
      const timestamp = req.headers["x-webhook-timestamp"];

      // Confirm we have the required headers
      if (!signature || !timestamp) {
        console.error("Missing required headers:", { signature, timestamp });
        return res.status(400).send("Missing required headers");
      }

      // Log the key pieces for verification
      console.log("Verifying with:", {
        signatureLength: signature ? signature.length : 0,
        bodyLength: bodyString.length,
        timestamp,
      });

      // Try verification with both Buffer and string versions
      const isVerified = Cashfree.PGVerifyWebhookSignature(
        signature,
        bodyString,
        timestamp
      );

      console.log({ isVerified });

      if (!isVerified) {
        return res.status(400).send("Signature verification failed");
      }

      // Parse the body string to JSON for processing
      const parsedBody = JSON.parse(bodyString);
      console.log("parsedBody >>> ", parsedBody);

      // Process based on event type
      // Add your webhook handling logic here

      res.status(200).send("Webhook processed successfully");
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = paymentRouter;
