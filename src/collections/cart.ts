import { model, Schema, Document, Model, Types } from "mongoose";
import { User } from "./user";

export interface ICart extends Document {
  userId: string;
  creationDate: Date;
}

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  creationDate: Date,
});

CartSchema.path("userId").validate(async (userId: string) => {
  const user = await User.findOne({ _id: userId }).exec();

  return !!user;
}, "User ID invalid.");

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
    const cart = await Cart.findOne({_id: cartId}).exec();

    if (!cart) {
        return false;
    }

    await Cart.deleteOne({_id: cartId}).exec();

    return true;
}

export const Cart = model<ICart, ICartModel>("Cart", CartSchema);
