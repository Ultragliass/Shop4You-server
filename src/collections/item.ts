import { model, Schema, Document, Model, Types } from "mongoose";
import { Category, CategorySchema, ICategory } from "./category";

interface IItem extends Document {
  name: string;
  category: ICategory;
  price: number;
  URLPath: string;
}

const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  category: { type: CategorySchema, required: true },
  price: { type: Number, required: true },
  URLPath: { type: String, required: true },
});

ItemSchema.path("name").validate(async (name: string) => {
  const item = await Item.findOne({ name }).exec();

  const isItemExist = !!item;

  return !isItemExist;
}, "Duplicate item already exists.");

ItemSchema.path("category").validate(async (itemCategory: string) => {
  const category = await Category.findOne({ name: itemCategory }).exec();

  const isCategoryValid = !!category;

  return isCategoryValid;
}, "Invalid category.");

ItemSchema.path("price").validate((price: number) => {
  return price > 0;
}, "Price must be more than 0.");

ItemSchema.path("URLPath").validate((url: string) => {
  const urlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|JPG|jpeg|JPEG)/;

  return urlRegex.test(url);
}, "Invalid URL or format.");

export interface IItemModel extends Model<IItem> {
  addItem(item: IItem): Promise<string>;
  removeItem(_id: string): Promise<string>;
}

ItemSchema.statics.addItem = async (newItem: IItem): Promise<string> => {
  const item = new Item({
    ...newItem,
  });

  const { _id: itemId } = await item.save();

  return itemId;
};

export const Item = model<IItem, IItemModel>("Item", ItemSchema);
