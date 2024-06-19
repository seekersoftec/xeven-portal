import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from '@/database/toJSON';

export interface INotice extends Document {
  title: string;
  details: string;
  date: Date;
  school: mongoose.Types.ObjectId;
}

const noticeSchema: Schema<INotice> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
noticeSchema.plugin(toJSON);

const Notice: Model<INotice> = mongoose.model<INotice>('notice', noticeSchema);

export default Notice;
