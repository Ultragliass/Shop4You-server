import { Router } from "express";
import { Cart, Order } from "../collections";
import { JWTRequest } from "../models/JWTRequest";

const orderRouter = Router();

orderRouter.get("/:orderId", async (req: JWTRequest, res) => {
  const { orderId } = req.params;

  const { userId } = req.user;
  try {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      return res
        .status(404)
        .send({ success: false, error: "Order does not exist." });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .send({ success: false, error: "This order is not yours." });
    }

    res.send({ success: true, order });
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

    const finalPrice = cart.cartItems.reduce(
      (total, cartItem) => total + cartItem.totalPrice,
      0
    );

    const order = await Order.createOrder(orderDetails, userId, finalPrice);

    res.send({ success: true, order });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

export { orderRouter };
