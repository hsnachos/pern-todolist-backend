const express = require("express");
const { client } = require("../client");

const router = express.Router();

//CRUD

//Create todo
router.post("/", async (req, res) => {
  try {
    const { contents } = req.body;

    const todo = await client.todo.create({
      data: {
        contents,
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
    const todos = await client.todo.findMany();

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

    const todo = await client.todo.update({
      where: {
        id,
      },
      data: {
        contents,
      },
    });

    return res.json(todo);
  } catch (error) {
    console.error(error);

    return res.status(500).send("error");
  }
});

// Delete todo
router.delete("/:id", async (req, res) => {
  try {
    const id = +req.params.id;

    const post = await client.todo.delete({
      where: {
        id,
      },
    });

    return res.json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).send("error");
  }
});

module.exports = router;
