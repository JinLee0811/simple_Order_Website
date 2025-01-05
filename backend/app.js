import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/meals", async (req, res) => {
  const meals = await fs.readFile("./data/available-meals.json", "utf8");
  res.json(JSON.parse(meals));
});

app.post("/orders", async (req, res) => {
  try {
    const orderData = req.body.order;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: "Missing order items." });
    }

    const customer = orderData.customer;
    if (
      !customer ||
      !customer.email ||
      !customer.email.includes("@") ||
      !customer.name ||
      customer.name.trim() === "" ||
      !customer.street ||
      customer.street.trim() === "" ||
      !customer["postal-code"] ||
      customer["postal-code"].trim() === "" ||
      !customer.city ||
      customer.city.trim() === ""
    ) {
      return res.status(400).json({
        message: "Missing or invalid customer data.",
      });
    }

    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toFixed(0),
    };

    // Read and update orders.json
    let allOrders = [];
    try {
      const orders = await fs.readFile("./data/orders.json", "utf8");
      if (orders.trim() !== "") {
        allOrders = JSON.parse(orders);
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Error reading orders.json:", error.message);
        throw error;
      }
      console.log("orders.json 파일이 없으므로 새로 생성합니다.");
    }

    // Add new order
    allOrders.push(newOrder);

    // Write updated orders to file
    try {
      await fs.writeFile("./data/orders.json", JSON.stringify(allOrders, null, 2));
    } catch (error) {
      console.error("Error writing to orders.json:", error.message);
      return res.status(500).json({ message: "Failed to save the order." });
    }

    // Send success response
    res.status(201).json({ message: "Order created successfully!", order: newOrder });
  } catch (error) {
    console.error("Unexpected error processing order:", error.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);
