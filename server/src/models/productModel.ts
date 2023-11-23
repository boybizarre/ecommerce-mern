import { Model, Schema, model } from 'mongoose';

export interface IProduct {
  productName: string;
  price: number;
  description: string;
  imageURL: string;
  stockQuantity: number;
}

const productSchema = new Schema<IProduct>({
  productName: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be less than 1!'],
  },

  description: {
    type: String,
    required: true,
  },

  imageURL: {
    type: String,
    required: true,
  },

  stockQuantity: {
    type: Number,
    required: true,
    min: [0, "Stock can't be bess than 1!"],
  },
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
