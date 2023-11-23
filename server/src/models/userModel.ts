import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  availableMoney: number;
  correctPassword?: (
    candidatePassword: string,
    password: string
  ) => Promise<boolean>;
  purchasedItems: string[];
}

// interface IUserMethods {
//   correctPassword(candidatePassword: string, password: string): boolean;
// }

// type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  availableMoney: {
    type: Number,
    default: 5000,
  },

  purchasedItems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: [],
    },
  ],
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword); // returns true or false
};

const User = model<IUser>('User', UserSchema);

export default User;
