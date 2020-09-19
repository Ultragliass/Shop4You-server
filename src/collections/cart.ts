import { model, Schema, Document, Model, Types } from "mongoose";
import { User } from "./user";
import { CartItem, CartItemSchema, ICartItem } from "./cartItem";
import { Item } from "./item";

export interface ICart extends Document {
  userId: string;
  creationDate: Date;
  cartItems: ICartItem[];
  addCartItem(itemId: string, amount: number): Promise<string>;
  removeCartItem(cartItemId: string): Promise<void>;
}

export const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  creationDate: Date,
  cartItems: [CartItemSchema],
});

CartSchema.path("userId").validate(async (userId: string) => {
  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}, "User does not exist.");

export interface ICartModel extends Model<ICart> {
  createCart(userId: string): Promise<string>;
  deleteCart(cartId: string): Promise<void>;
}

CartSchema.statics.createCart = async (userId: string): Promise<string> => {
  const cart = new Cart({
    userId,
    cartItems: [],
    creationDate: new Date(),
  });

  const { _id: cartId } = await cart.save();

  return cartId;
};

CartSchema.statics.deleteCart = async (cartId: string): Promise<void> => {
  try {
    const isExist = await Cart.findByIdAndDelete(cartId).exec();

    if (!isExist) {
      throw new Error("Cart does not exist.");
    }
  } catch {
    throw new Error("Invalid cart ID.");
  }
};

CartSchema.methods.addCartItem = async function (
  itemId,
  amount
): Promise<string> {
  try {
    const item = await Item.findById(itemId).exec();

    if (!item) {
      throw new Error("Item does not exist.");
    }

    const index = this.cartItems.findIndex((cartItem) =>
      Types.ObjectId(itemId).equals(cartItem.itemId)
    );

    if (index > -1) {
      throw new Error("Item already in the cart.");
    }

    const cartItem = new CartItem({
      itemId,
      amount,
      totalPrice: amount * item.price,
    });

    this.cartItems.push(cartItem);

    await this.save({
      validateModifiedOnly: true,
    });

    return this.cartItems[this.cartItems.length - 1]._id;
  } catch (error) {
    if (error.message.includes("_id")) {
      throw new Error("Item ID invalid.");
    }

    throw new Error(error);
  }
};

CartSchema.methods.removeCartItem = async function (
  cartItemId: string
): Promise<void> {
  try {
    const index = this.cartItems.findIndex((cartItem) =>
      Types.ObjectId(cartItemId).equals(cartItem._id)
    );

    if (index < 0) {
      throw new Error("Item does not exist in cart.");
    }

    this.cartItems.splice(index, 1);

    await this.save({ validateModifiedOnly: true });
  } catch (error) {
    throw new Error(error);
  }
};

export const Cart = model<ICart, ICartModel>("Cart", CartSchema);
