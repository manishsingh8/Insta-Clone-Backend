const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const USER = mongoose.model("USER");
const bcrypt = require("bcrypt"); //bcrypt npm package used to hash the password
const jwt = require('jsonwebtoken');
const {Jwt_secret} = require('../keys');
const requireLogin = require('../middlewares/requireLogin');

router.get("/", (req, res) => {
  res.send("Hello");
});




// signup route
router.post("/signup", (req, res) => {
  const { name, userName, email, password } = req.body;
  if (!name || !email || !userName || !password) {
    return res.status(422).json({ error: "Please add all the field" });
  }

  USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then(
    (savedUser) => {
      if (savedUser) {
        return res
          .status(400)
          .json({ error: "User alreasy exits with this email or UserName" });
      }
      // bcrypt is used to hash the password
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new USER({
          name,
          email,
          userName,
          password: hashedPassword,
        });
        user.save()
          .then((user) => {
            res.json({ message: "Registered successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  );
});

// signin route
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email!!" });
    }
    bcrypt
      .compare(password, savedUser.password) //bcrypt.compare used to compare the user input password with password saved in DB with same email
      .then((match) => {
        if (match) {
          // return res.status(200).json({ message: "Signed In Successfully" });
          // sending the token after user gets signin
          const token = jwt.sign({_id:savedUser.id},Jwt_secret)
          res.json(token);
          console.log(token);
        } else {
          return res.status(422).json({ error: "Invlid Password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
