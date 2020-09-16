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
  const item = await Item.findOne({ name }).exec();

  const isItemExist = !!item;

  return !isItemExist;
}, "Duplicate item already exists.");

ItemSchema.path("categoryId").validate(async (categoryId: string) => {
  const category = await Category.findOne({ _id: categoryId }).exec();

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
  addItem(item: IItem): Promise<string>;
  removeItem(id: string): Promise<boolean>;
}

ItemSchema.statics.addItem = async (newItem: IItem): Promise<string> => {
  const item = new Item({
    ...newItem,
  });

  const { _id: itemId } = await item.save();

  return itemId;
};

ItemSchema.statics.removeItem = async (id: string): Promise<boolean> => {
  const item = await Item.findOne({ _id: id }).exec();

  if (!item) {
    return false;
  }

  await Item.deleteOne({ _id: id }).exec();

  return true;
};

export const Item = model<IItem, IItemModel>("Item", ItemSchema);
