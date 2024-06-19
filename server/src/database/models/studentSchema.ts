import mongoose, { Document, Schema, Model, model } from 'mongoose';

// Define an interface representing a document in MongoDB.
export interface IExamResult {
  subName: mongoose.Schema.Types.ObjectId;
  marksObtained: number;
}

export interface IAttendance {
  date: Date;
  status: 'Present' | 'Absent';
  subName: mongoose.Schema.Types.ObjectId;
}

export interface IStudent extends Document {
  name: string;
  rollNum: number;
  email: string;
  password: string;
  sClassName: mongoose.Schema.Types.ObjectId;
  school: mongoose.Schema.Types.ObjectId;
  role?: string;
  hasPaidSchoolFee?: boolean;
  examResult: IExamResult[];
  attendance: IAttendance[];
}

// Define the schema corresponding to the document interface.
const studentSchema: Schema<IStudent> = new Schema({
  name: {
    type: String,
    required: true,
  },
  rollNum: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
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
    required: true,
  },
  role: {
    type: String,
    default: 'Student',
  },
  hasPaidSchoolFee: {
    type: Boolean,
    required: false,
    default: false,
  },
  examResult: [
    {
      subName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
      },
      marksObtained: {
        type: Number,
        default: 0,
      },
    },
  ],
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
      },
      subName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true,
      },
    },
  ],
});

// Create and export the model.
const Student: Model<IStudent> = model('Student', studentSchema);
export default Student;
