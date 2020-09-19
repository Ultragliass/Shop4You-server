import { model, Schema, Document, Model } from "mongoose";
import { Category } from "./category";

export interface IItem extends Document {
  name: string;
  categoryId: string;
  price: number;
  URLPath: string;
}

export const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  price: { type: Number, required: true },
  URLPath: { type: String, required: true },
});

ItemSchema.path("name").validate(async (name: string) => {
  return name.trim();
}, "Name is required.");

ItemSchema.path("categoryId").validate(async (categoryId: string) => {
  const category = await Category.findById(categoryId).exec();

  return !!category;
}, "Category does not exist.");

ItemSchema.path("price").validate((price: number) => {
  return price > 0;
}, "Price must be more than 0.");

ItemSchema.path("URLPath").validate((url: string) => {
  const urlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|JPG|jpeg|JPEG)/;

  return urlRegex.test(url);
}, "Invalid URL or image format.");

export interface IItemModel extends Model<IItem> {
  addItem(newItem: IItem): Promise<string>;
  updateItem(updatedItem: IItem, itemId: string): Promise<void>;
  removeItem(itemId: string): Promise<boolean>;
}

ItemSchema.statics.addItem = async (newItem: IItem): Promise<string> => {
  const isItemExist = await Item.findOne({ name: newItem.name }).exec();

  if (isItemExist) {
    throw new Error("Item already exists.");
  }

  const item = new Item({
    ...newItem,
  });

  const { _id: itemId } = await item.save();

  return itemId;
};

ItemSchema.statics.updateItem = async (
  updatedItem: IItem,
  itemId: string
): Promise<void> => {
  await Item.updateOne(
    { _id: itemId },
    { $set: { ...updatedItem } },
    { runValidators: true }
  );
};

ItemSchema.statics.removeItem = async (itemId: string): Promise<void> => {
  try {
    await Item.findByIdAndDelete(itemId).exec();
  } catch {
    throw new Error("Invalid item ID.");
  }
};

export const Item = model<IItem, IItemModel>("Item", ItemSchema);
