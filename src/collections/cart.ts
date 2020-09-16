import { model, Schema, Document, Model, Types } from "mongoose";
import { User } from "./user";
import { CartItem, CartItemSchema, ICartItem } from "./cartItem";
import { IItem } from "./item";

export interface ICart extends Document {
  userId: string;
  creationDate: Date;
  cartItems: ICartItem[];
  addCartItem(
    item: Pick<IItem, "_id" | "price">,
    amount: number
  ): Promise<string>;
  removeCartItem(cartItemId: string): Promise<boolean>;
}

export const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  creationDate: Date,
  cartItems: [CartItemSchema],
});

CartSchema.path("userId").validate(async (userId: string) => {
  const user = await User.findOne({ _id: userId }).exec();

  return !!user;
}, "User does not exist.");

export interface ICartModel extends Model<ICart> {
  createCart(userId: string): Promise<string>;
  deleteCart(cartId: string): Promise<boolean>;
}

CartSchema.statics.createCart = async (userId: string): Promise<string> => {
  const cart = new Cart({
    userId,
    creationDate: new Date(),
  });

  const { _id: cartId } = await cart.save();

  return cartId;
};

CartSchema.statics.deleteCart = async (cartId: string): Promise<boolean> => {
  const cart = await Cart.findOne({ _id: cartId }).exec();

  if (!cart) {
    return false;
  }

  await Cart.deleteOne({ _id: cartId }).exec();

  return true;
};

CartSchema.methods.addCartItem = async function (
  { _id: itemId, price },
  amount
): Promise<string> {
  const cartItem = new CartItem({
    itemId,
    amount,
    totalPrice: amount * price,
  });

  this.cartItems.push(cartItem);

  await this.save({
    validateModifiedOnly: true,
  });

  return this.cartItems[this.cartItems.length - 1]._id;
};

CartSchema.methods.removeCartItem = async function (
  cartItemId: string
): Promise<boolean> {
  const index = this.cartItems.findIndex((cartItem) =>
    Types.ObjectId(cartItemId).equals(cartItem._id)
  );

  if (index < 0) {
    return false;
  }

  this.cartItems.splice(index, 1);

  await this.save({ validateModifiedOnly: true });

  return true;
};

export const Cart = model<ICart, ICartModel>("Cart", CartSchema);
