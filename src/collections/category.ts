import { model, Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

export const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

CategorySchema.path("name").validate(async (name: string) => {
  const category = await Category.findOne({ name }).exec();

  const isCategoryExist = !!category;

  return !isCategoryExist;
}, "Category already exists.");

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
