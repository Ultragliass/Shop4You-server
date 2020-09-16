import { Schema, Document, model } from "mongoose";
import { Item } from "./item";

export interface ICartItem extends Document {
  itemId: string;
  amount: number;
  totalPrice: number;
}

export const CartItemSchema = new Schema<ICartItem>({
  itemId: { type: String, required: true },
  amount: { type: Number, required: true },
  totalPrice: Number,
});

CartItemSchema.path("itemId").validate(async (itemId: string) => {
  const item = await Item.findOne({ _id: itemId }).exec();

  return !!item;
}, "Item does not exist.");

export const CartItem = model<ICartItem>("CartItem", CartItemSchema);
