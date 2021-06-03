const express = require("express");
const { client } = require("../client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    return res.json(existUser);
  } catch (error) {
    console.error(error);

    return res.status(500).send(error);
  }
});

module.exports = router;
