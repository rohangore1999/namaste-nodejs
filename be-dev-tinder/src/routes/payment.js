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
  bodyParser.raw({ type: "*/*" }), // Use raw parser for all content types
  async (req, res) => {
    try {
      console.log("req.rawBody in /webhook >>> ", req.body); // req.body will be Buffer

      const signature = req.headers["x-webhook-signature"];
      const rawBody = req.body.toString(); // Convert Buffer to string
      const timestamp = req.headers["x-webhook-timestamp"];

      const isVerified = Cashfree.PGVerifyWebhookSignature(
        signature,
        rawBody,
        timestamp
      );

      console.log({ isVerified });

      console.log("req.body >>> ", JSON.parse(req.rawBody));

      res.send("OK");
    } catch (err) {
      console.error(err);
      throw new Error("Internal Server Error");
    }
  }
);

module.exports = paymentRouter;
