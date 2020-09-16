import { Schema, Document, model } from "mongoose";

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

export const CartItem = model<ICartItem>("CartItem", CartItemSchema);
