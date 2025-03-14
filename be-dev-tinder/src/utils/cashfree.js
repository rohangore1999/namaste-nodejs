const { Cashfree } = require('cashfree-pg');

Cashfree.XClientId = '89051fdd7d7f733aa9f294c8215098';
Cashfree.XClientSecret = process.env.CASHFREE_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

module.exports = Cashfree;
