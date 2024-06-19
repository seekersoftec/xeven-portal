import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentClass extends Document {
  sClassName: string;
  school: mongoose.Types.ObjectId;
}

const studentClassSchema: Schema<IStudentClass> = new mongoose.Schema(
  {
    sClassName: {
      type: String,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
    },
  },
  { timestamps: true }
);

const StudentClass: Model<IStudentClass> = mongoose.model<IStudentClass>(
  'StudentClass',
  studentClassSchema
);

export default StudentClass;
