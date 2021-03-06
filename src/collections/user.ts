import { model, Schema, Document, Model } from "mongoose";
import { hash, compare } from "bcrypt";
import { Cart } from "./cart";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  lastname: string;
  id: string;
  city: string;
  street: string;
  role: string;
  currentCartId: string | null;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  id: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  role: { type: String, default: "user" },
  currentCartId: { type: String || null, default: null },
});

UserSchema.path("email").validate((email: string) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email);
}, "Invalid email.");

UserSchema.path("id").validate((id: string) => {
  const idRegex = /^[0-9]{8,9}$/;

  return idRegex.test(id);
}, "Id invalid.");

export interface IUserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
  register(userdata: IUser): Promise<string>;
  updateUserCart(userId: string, cartId: string | null): Promise<void>;
}

UserSchema.statics.login = async (
  email: string,
  password: string
): Promise<IUser> => {
  const user = await User.findOne({ email: email.toLowerCase() }).exec();

  if (!user) {
    throw new Error("Username and password don't match.");
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Username and password don't match.");
  }

  return user;
};

UserSchema.statics.register = async ({
  password,
  ...userData
}: IUser): Promise<string> => {
  const isEmailExist = await User.findOne({ email: userData.email }).exec();

  if (isEmailExist) {
    throw new Error("User already exists.");
  }

  const isIdExist = await User.findOne({ id: userData.id });

  if (isIdExist) {
    throw new Error("Duplicate ID already exists. Please contact support.");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;

  if (!passwordRegex.test(password)) {
    throw new Error("Invalid password.");
  }

  const hashedPassword = await hash(password, 10);

  const user = new User({
    ...userData,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    role: "user",
  });

  const { _id: userId } = await user.save();

  return userId;
};

UserSchema.statics.updateUserCart = async (
  userId: string,
  cartId: string | null
): Promise<void> => {
  const user = await User.findById(userId).exec();

  if (!user) {
    throw new Error("User does not exist.");
  }

  if (!cartId) {
    user.currentCartId = null;

    await user.save();

    return;
  }

  const cart = await Cart.findById(cartId).exec();

  if (!cart) {
    throw new Error("Cart does not exist.");
  }

  if (cart.userId !== userId) {
    throw new Error("Cart does not belong to this user.");
  }

  user.currentCartId = cart._id;

  await user.save();
};

export const User = model<IUser, IUserModel>("User", UserSchema);
