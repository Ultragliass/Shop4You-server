import { Router } from "express";
import { Cart } from "../collections";
import { JWTRequest } from "../models/JWTRequest";

const cartRouter = Router();

cartRouter.get("/:cartId", async (req: JWTRequest, res) => {
  const { cartId } = req.params;

  const { userId } = req.user;

  try {
    const cart = await Cart.findById(cartId).exec();

    if (!cart) {
      return res
        .status(404)
        .send({ success: false, error: "Cart does not exist." });
    }

    if (cart.userId !== userId) {
      return res
        .status(403)
        .send({ success: false, error: "This cart does not belong to you!" });
    }

    res.send({ success: true, cart });
  } catch {
    res.status(400).send({ success: false, error: "Invalid cart ID." });
  }
});

cartRouter.post("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  try {
    const cartId = await Cart.createCart(userId);

    res.send({ success: true, cartId });
  } catch {
    res.status(404).send({ success: false, error: "User does not exist." });
  }
});

cartRouter.delete("/", async (req: JWTRequest, res) => {
  const { cartId } = req.body;

  const { userId } = req.user;

  try {
    const cart = await Cart.findById(cartId).exec();

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

    await Cart.deleteCart(cartId);

    res.send({ success: true, msg: "Cart deleted." });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

cartRouter.post("/add_item", async (req: JWTRequest, res) => {
  const { itemId, amount, cartId } = req.body;

  const { userId } = req.user;

  try {
    const cart = await Cart.findById(cartId).exec();

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

    const cartItemId = await cart.addCartItem(itemId, amount);

    res.send({ success: true, cartItemId });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

cartRouter.delete("/remove_item", async (req: JWTRequest, res) => {
  const { cartItemId, cartId } = req.body;

  const { userId } = req.user;

  try {
    const cart = await Cart.findById(cartId).exec();

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

    await cart.removeCartItem(cartItemId);

    res.send({ success: true, msg: "Cart item removed." });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

export { cartRouter };
