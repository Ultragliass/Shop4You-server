import { model, Schema, Document, Model } from "mongoose";
import { Cart } from "./cart";
import { User } from "./user";

export interface IOrder extends Document {
  userId: string;
  cartId: string;
  finalPrice: string;
  orderDate: Date;
  deliveryCity: string;
  deliveryStreet: string;
  deliveryDate: Date;
  lastCreditDigits: string;
}

export const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  cartId: { type: String, required: true },
  finalPrice: { type: Number, required: true },
  orderDate: Date,
  deliveryCity: { type: String, required: true },
  deliveryStreet: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  lastCreditDigits: { type: String, required: true },
});

OrderSchema.path("userId").validate(async (userId: string) => {
  const user = await User.findById(userId).exec();

  return !!user;
}, "User does not exist.");
OrderSchema.path("cartId").validate(async (cartId: string) => {
  const cart = await Cart.findById(cartId).exec();

  return !!cart;
}, "Cart does not exist.");

OrderSchema.path("deliveryDate").validate((deliveryDate: Date) => {
  return deliveryDate > new Date();
}, "Date must be later than the current date.");

export interface IOrderModel extends Model<IOrder> {
  createOrder(
    orderDetails: Omit<IOrder, "orderDate" | "userId" | "finalPrice">,
    userId: string,
    finalPrice: number
  ): Promise<IOrder>;
}

OrderSchema.statics.createOrder = async (
  orderDetails: Omit<IOrder, "orderDate" | "userId" | "finalPrice">,
  userId: string,
  finalPrice: number
): Promise<IOrder> => {
  const regex = /4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11}/;

  const { lastCreditDigits } = orderDetails;

  if (!regex.test(lastCreditDigits)) {
    throw new Error("Credit card invalid.");
  }

  const order = new Order({
    ...orderDetails,
    lastCreditDigits: lastCreditDigits.substr(lastCreditDigits.length - 4),
    userId,
    finalPrice,
    orderDate: new Date(),
  });

  return await order.save();
};

export const Order = model<IOrder, IOrderModel>("Order", OrderSchema);
