/**
 * *Create account is found here.
 */
const model = require("../models");
const bcrypt = require("bcrypt");
const authController = {
  registerAccount: async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = { username, password: hashPassword };
      await model.User.create(user);

      res
        .status(201) //created
        .json({ message: "Account Registered" });
    } catch (error) {
      if (error.code === 11000 && error.name === "MongoServerError") {
        return res
          .status(409) //conflict
          .json({ message: `${error.keyValue.username} already taken` });
      } else {
        return res
          .status(500) //internal server error
          .json({ error: error, message: "Internal Server Error" });
      }
    }
  },
  loginAccount: async (req, res) => {
    const { username, password } = req.query;
    try {
      const user = await model.User.findOne({ username: username });
      if (!user) {
        return res.status(401).json({ message: "No username found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Wrong Password" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res
        .status(500) //internal server error
        .json({ error: error, message: "Internal Server Error" });
    }
  },
};

module.exports = authController;
