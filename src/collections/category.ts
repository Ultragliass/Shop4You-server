import { model, Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

export const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

export interface ICategoryModel extends Model<ICategory> {
  addCategory(category: ICategory): Promise<string>;
}

CategorySchema.statics.addCategory = async (name: string): Promise<string> => {
  const category = new Category({
    name,
  });

  const { _id: categoryId } = await category.save();

  return categoryId;
};

export const Category = model<ICategory, ICategoryModel>(
  "Category",
  CategorySchema
);
