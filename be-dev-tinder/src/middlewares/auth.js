const adminAuth = (req, res, next) => {
  console.log("In middleware");
  const a = true
  if (a) {
    next();
  } else {
    res.status(401).send("Unauthorised");
  }
};

module.exports = {
    adminAuth
}