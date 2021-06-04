const express = require("express");
const { client } = require("../middlewares/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send("Not exist email.");

    if (!password) return res.status(400).send("Not exist password.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const existUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) return res.status(400).send("Already exist user.");

    const user = await client.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send("Not exist email.");

    if (!password) return res.status(400).send("Not exist password.");

    const existUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (!existUser) {
      return res.status(400).send("Not exist user.");
    }

    const checkPassword = await bcrypt.compare(password, existUser.password);

    if (!checkPassword) {
      return res.status(400).send("Wrong password.");
    }

    // const token = await jwt.sign({ id: existUser.id }, process.env.JWT_SECRET, {
    //   expiresIn: "1m",
    // });
    const token = await jwt.sign({ id: existUser.id }, process.env.JWT_SECRET);

    return res.json({ ok: true, token });
  } catch (error) {
    console.error(error);

    return res.status(500).send(error);
  }
});

module.exports = router;
