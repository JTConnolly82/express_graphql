const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: args => {
    return (
      User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user) {
            throw new Error("account already registered with this email");
          }
          return bcrypt.hash(args.userInput.password, 12);
        })
        // takes pw, salts 12 (amnt 2nd arg) times
        .then(hashedPw => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPw
          });
          return user.save();
        })
        .then(res => {
          return { ...res._doc, password: null, _id: res.id };
        })
        .catch(err => {
          console.dir(err);
          throw err;
        })
    );
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "1h"
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
