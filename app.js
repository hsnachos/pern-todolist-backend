const express = require("express");

const todoRoutes = require("./routes/todo");
const userRoutes = require("./routes/user");

const app = express();

const port = 3010;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/todo", todoRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server listening... Port: ${port}`);
});
