import { model, Schema, Document, Model, Types } from "mongoose";
import { User } from "./user";
import { CartItem, CartItemSchema, ICartItem } from "./cartItem";
import { Item } from "./item";

export interface ICart extends Document {
  userId: string;
  creationDate: Date;
  cartItems: ICartItem[];
  addCartItem(itemId: string, amount: number): Promise<string>;
  changeCartItemAmount(cartItemId: string, newAmount: number): Promise<void>;
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
  emptyCart(cartId: string): Promise<void>;
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

CartSchema.statics.emptyCart = async (cartId: string): Promise<void> => {
  const cart = await Cart.updateOne(
    { _id: cartId },
    { $set: { cartItems: [] } }
  ).exec();

  if (!cart) {
    throw new Error("Cart does not exist.");
  }
};

CartSchema.methods.addCartItem = async function (
  itemId,
  amount
): Promise<string> {
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
};

CartSchema.methods.changeCartItemAmount = async function (
  cartItemId: string,
  newAmount: number
) {
  const index = this.cartItems.findIndex((cartItem) =>
    Types.ObjectId(cartItemId).equals(cartItem._id)
  );

  if (index < 0) {
    throw new Error("Item does not exist in cart.");
  }

  if (newAmount === this.cartItems[index].amount) {
    throw new Error("Amount is the same.");
  }

  if (newAmount <= 0) {
    this.cartItems.splice(index, 1);
  } else {
    const item = await Item.findById(this.cartItems[index].itemId).exec();

    this.cartItems[index].amount = newAmount;

    this.cartItems[index].totalPrice = item!.price * newAmount;
  }

  await this.save({ validateModifiedOnly: true });
};

CartSchema.methods.removeCartItem = async function (
  cartItemId: string
): Promise<void> {
  const index = this.cartItems.findIndex((cartItem) =>
    Types.ObjectId(cartItemId).equals(cartItem._id)
  );

  if (index < 0) {
    throw new Error("Item does not exist in cart.");
  }

  this.cartItems.splice(index, 1);

  await this.save({ validateModifiedOnly: true });
};

export const Cart = model<ICart, ICartModel>("Cart", CartSchema);
