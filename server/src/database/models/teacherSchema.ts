import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from '@/database/toJSON';

export interface ITeacher extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  school: mongoose.Types.ObjectId;
  teachSubject?: mongoose.Types.ObjectId;
  teachSClass: mongoose.Types.ObjectId;
  attendance: {
    date: Date;
    status?: string;
    presentCount?: string;
    absentCount?: string;
  }[];
}

const teacherSchema: Schema<ITeacher> = new Schema(
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
      default: 'Teacher',
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subject',
    },
    teachSClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sClass',
      required: true,
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
        },
        presentCount: {
          type: String,
        },
        absentCount: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
teacherSchema.plugin(toJSON);

const Teacher: Model<ITeacher> = mongoose.model<ITeacher>(
  'teacher',
  teacherSchema
);

export default Teacher;
