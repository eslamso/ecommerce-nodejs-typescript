import mongoose from "mongoose";
export interface ICategory {
  name: string;
  slug?: string;
  image?: string;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  slug: { type: String, lowercase: true },
  image: String,
});

export default mongoose.model<ICategory>("Category", categorySchema);
