/**
 * *Create account is found here.
 */
const model = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      const existingRefreshToken = await model.RefreshToken.findOne({
        userId: user._id,
      });
      if (existingRefreshToken)
        await model.RefreshToken.deleteOne({ _id: existingRefreshToken._id });

      const accessToken = await jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "5m" }
      );
      const refreshToken = await jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
      );
      const newRefreshToken = new model.RefreshToken({
        userId: user._id,
        token: refreshToken,
      });

      await newRefreshToken.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 7000,
      });
      res
        .status(200)

        .json({ accessToken: accessToken, user: user });
    } catch (error) {
      res
        .status(500) //internal server error
        .json({ error: error, message: "Internal Server Error" });
    }
  },

  logoutAccount: async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, decoded) => {
        console.log(decoded);
        if (err) return res.status(401).json({ message: "Unauthorized" });
        model.User.findById(decoded.userId).then((result) => {
          if (result)
            model.RefreshToken.findOneAndDelete({ userId: result._id }).then(
              () => {
                res
                  .status(200)
                  .clearCookie("jwt", {
                    httpOnly: true,
                    sameSite: "None",
                    secure: true,
                  })
                  .json({ message: "Log out successful" });
              }
            );
        });
      }
    );
  },
};

module.exports = authController;
