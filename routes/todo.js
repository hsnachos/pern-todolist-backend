const express = require("express");
const { client } = require("../middlewares/client");
const { verify } = require("../middlewares/auth");

const router = express.Router();

//CRUD

//Create todo
router.post("/", async (req, res) => {
  try {
    const { contents } = req.body;

    //console.log(req.headers);

    if (!contents) {
      return res.status(400).send("Not exist contents.");
    }

    // if (!token) {
    //   return res.status(400).send("Not exist token.");
    // }

    const verifyTokenn = await verifyToken(req.headers.token);

    console.log(verifyTokenn);

    if (!verifyTokenn.ok) {
      return res.status(400).send("Token error");
    }

    const todo = await client.todo.create({
      data: {
        contents,
        userId: verifyTokenn.verifyToken.id,
      },
    });

    return res.json(todo);
  } catch (error) {
    console.error(error);

    return res.status(500).send("error");
  }
});

//Read todo
router.get("/", async (req, res) => {
  try {
    const verifyTokenn = await verifyToken(req.headers.token);

    if (!verifyTokenn.ok) {
      return res.status(400).send("Token error.");
    }

    // const todos = await client.todo.findMany({
    //   where: {
    //     userId: verifyTokenn.verifyToken.id,
    //   },
    //   select: {
    //     contents: true,
    //     userId: true,
    //     user: {
    //       select: {
    //         email: true,
    //       },
    //     },
    //   },
    // });

    const todos = await client.todo.findMany({
      where: {
        userId: verifyTokenn.verifyToken.id,
      },
      select: {
        contents: true,
        userId: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.json(todos);
  } catch (error) {
    console.error(error);

    return res.status(500).send("error");
  }
});

//Update todo
router.put("/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const { contents } = req.body;

    const verifyToken = await verify(req.headers.token);

    if (!verifyToken.ok) {
      return res.status(300).send("Token error.");
    }

    const todo = await client.todo.findUnique({
      where: {
        id,
      },
    });

    if (verifyToken.verifyToken.id !== todo.userId) {
      return res.status(400).send("You can't do that.");
    }

    const updateTodo = await client.todo.update({
      where: {
        id,
      },
      data: {
        contents,
      },
    });

    return res.json(updateTodo);
  } catch (error) {
    console.error(error);

    return res.status(500).send("error");
  }
});

// Delete todo
router.delete("/:id", async (req, res) => {
  try {
    const id = +req.params.id;

    const verifyToken = await verify(req.headers.token);

    if (!verifyToken.ok) {
      return res.status(400).send("Token error.");
    }

    const todo = await client.todo.findUnique({
      where: {
        id,
      },
    });

    if (verifyToken.verifyToken.id !== todo.userId) {
      return res.status(400).send("You can't do that");
    }

    const deleteTodo = await client.todo.delete({
      where: {
        id,
      },
    });

    return res.json(deleteTodo);
  } catch (error) {
    console.error(error);

    return res.status(500).send("error");
  }
});

module.exports = router;
