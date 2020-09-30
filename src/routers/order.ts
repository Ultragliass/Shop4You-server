import { Router } from "express";
import { Cart, Order, User } from "../collections";
import { JWTRequest } from "../models/JWTRequest";
import * as fs from "fs";

const orderRouter = Router();

orderRouter.get("/:orderId", async (req: JWTRequest, res) => {
  const { orderId } = req.params;

  const { userId, role } = req.user;
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      return res
        .status(404)
        .send({ success: false, error: "Order does not exist." });
    }

    if (order.userId !== userId && role !== "admin") {
      return res
        .status(403)
        .send({ success: false, error: "This order is not yours." });
    }

    const cart = await Cart.findById(order.cartId).exec();

    res.send({ success: true, order, cart: cart!.cartItems });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

orderRouter.post("/", async (req: JWTRequest, res) => {
  const orderDetails = req.body;

  const { userId } = req.user;

  try {
    const cart = await Cart.findById(orderDetails.cartId).exec();

    if (!cart) {
      return res
        .status(404)
        .send({ success: false, error: "Cart does not exist." });
    }

    if (cart.userId !== userId) {
      return res
        .status(403)
        .send({ success: false, error: "This cart does not belong to you." });
    }

    if (!cart.cartItems.length) {
      return res.status(400).send({ success: false, error: "Cart is empty." });
    }

    const finalPrice = cart.cartItems.reduce(
      (total, cartItem) => total + cartItem.totalPrice,
      0
    );

    const order = await Order.createOrder(orderDetails, userId, finalPrice);

    await User.updateUserCart(userId, null);

    res.send({ success: true, orderId: order._id });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

orderRouter.get("/print/:orderId", async (req: JWTRequest, res) => {
  const { orderId } = req.params;

  const { userId } = req.user;

  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      return res
        .status(404)
        .send({ success: false, error: "Order not found." });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .send({ success: false, error: "Order does not belong to you." });
    }

    const writeStream = fs.createWriteStream("receipt.txt");

    writeStream.write(
      `
    Order date: ${order.orderDate}. \n
    OrderId: ${order._id} \n
    Items: 
    Total price: ${order.finalPrice}. \n
    `,
      "base64"
    );

    writeStream.on("finish", () => {
      res.sendFile("receipt.txt");
    });
  } catch (error) {
    return res.status(400).send({ success: false, erorr: error.message });
  }
});

export { orderRouter };
