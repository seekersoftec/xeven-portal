import mongoose, { Document, Schema, Model, model } from 'mongoose';
import { toJSON } from '@/database/toJSON';

// Define an interface representing a document in MongoDB.
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  schoolName: string;
}

// Define the schema corresponding to the document interface.
const adminSchema: Schema<IAdmin> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      private: true,
    },
    role: {
      type: String,
      default: 'Admin',
    },
    schoolName: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
adminSchema.plugin(toJSON);

// Create and export the model.
const Admin: Model<IAdmin> = model('Admin', adminSchema);
export default Admin;
