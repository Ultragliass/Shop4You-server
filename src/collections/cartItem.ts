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
  try {
    const item = await Item.findById(itemId).exec();

    if (!item) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}, "Item does not exist.");

CartItemSchema.path("amount").validate((amount: number) => {
  return amount > 0
}, "Amount cannot be less than 1.");

export const CartItem = model<ICartItem>("CartItem", CartItemSchema);
