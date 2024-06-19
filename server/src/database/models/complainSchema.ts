import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from '@/database/toJSON';

interface IComplain extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  complaint: string;
  school: mongoose.Types.ObjectId;
}

const complainSchema: Schema<IComplain> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
complainSchema.plugin(toJSON);

const Complain: Model<IComplain> = mongoose.model<IComplain>(
  'complain',
  complainSchema
);

export default Complain;
