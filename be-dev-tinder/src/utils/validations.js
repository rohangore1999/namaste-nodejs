const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email should be valid");
  }
};

const validateReqBody = (reqBody) => {
  const allowedFields = ["firstName", "lastName", "skills", "photoUrl"];

  const isValid = Object.keys(reqBody).every((field) =>
    allowedFields.includes(field)
  );

  return isValid;
};

module.exports = {
  validateSignupData,
  validateReqBody,
};
