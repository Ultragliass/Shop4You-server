import { model, Schema, Document, Model } from "mongoose";
import { Item } from "./item";
import { Cart } from "./cart";

export interface IOrder extends Document {
  userId: string;
  cartId: string;
  finalPrice: string;
  orderDate: Date;
  deliveryCity: string;
  deliveryStreet: string;
  deliveryDate: Date;
  lastCreditDigits?: string;
}

export const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  cartId: { type: String, required: true },
  finalPrice: { type: Number, required: true },
  orderDate: Date,
  deliveryCity: { type: String, required: true },
  deliveryStreet: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  lastCreditDigits: String,
});

OrderSchema.path("userId").validate(async (userId: string) => {
  const user = await Item.findById(userId).exec();

  return !!user;
}, "User does not exist.");
OrderSchema.path("cartId").validate(async (cartId: string) => {
  const cart = await Cart.findById(cartId).exec();

  return !!cart;
}, "Cart does not exist.");

export interface IOrderModel extends Model<IOrder> {
  createOrder(orderDetails: Omit<IOrder, "orderDate">): Promise<IOrder>;
}

OrderSchema.statics.createOrder = async (
  orderDetails: Omit<IOrder, "orderDate">
): Promise<IOrder> => {
  const order = new Order({
    ...orderDetails,
    orderDate: new Date(),
  });

  return await order.save();
};

export const Order = model<IOrder, IOrderModel>("Order", OrderSchema);
