import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from '@/database/toJSON';

export interface ISubject extends Document {
  subName: string;
  subCode: string;
  sessions: number;
  sClassName: mongoose.Types.ObjectId;
  school?: mongoose.Types.ObjectId;
  teacher?: mongoose.Types.ObjectId;
}

const subjectSchema: Schema<ISubject> = new Schema(
  {
    subName: {
      type: String,
      required: true,
    },
    subCode: {
      type: String,
      required: true,
    },
    sessions: {
      type: Number,
      required: true,
    },
    sClassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sClass',
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teacher',
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
subjectSchema.plugin(toJSON);

const Subject: Model<ISubject> = mongoose.model<ISubject>(
  'subject',
  subjectSchema
);

export default Subject;
