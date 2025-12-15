require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/events", require("./routes/eventsRoutes"));

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () =>
  console.log("Server running on port", PORT)
);
