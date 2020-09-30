import { Router } from "express";
import { Cart, User } from "../collections";
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

    res.send({ success: true, cartItems: cart.cartItems });
  } catch {
    res.status(400).send({ success: false, error: "Invalid cart ID." });
  }
});

cartRouter.post("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  try {
    const cartId = await Cart.createCart(userId);

    await User.updateUserCart(userId, cartId);

    res.send({ success: true, cartId });
  } catch {
    res.status(404).send({ success: false, error: "User does not exist." });
  }
});

cartRouter.put("/clear_cart/:cartId", async (req: JWTRequest, res) => {
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
        .send({ success: false, error: "This cart does not belong to you." });
    }

    await Cart.emptyCart(cartId);

    res.send({ success: true, msg: "Cart emptied." });
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

    const cartItem = await cart.addCartItem(itemId, amount);

    res.send({ success: true, cartItem });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

cartRouter.put("/change_amount", async (req: JWTRequest, res) => {
  const { cartItemId, cartId, newAmount } = req.body;

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

    await cart.changeCartItemAmount(cartItemId, newAmount);

    if (newAmount <= 0) {
      res.send({ success: true, msg: "Item removed from cart." });
    } else {
      res.send({ success: true, msg: "Item amount changed." });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

cartRouter.put("/remove_item", async (req: JWTRequest, res) => {
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

    res.send({ success: true, cartItemId });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

export { cartRouter };
