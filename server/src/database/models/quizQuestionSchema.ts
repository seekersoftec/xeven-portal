import mongoose, { Schema, Document, Model } from 'mongoose';

export const questionTypes = ['MCQs', 'MAQs', 'boolean'] as const;

// Define the interface for a choice
export interface IChoice extends Document {
  type: string;
}

const choiceSchema: Schema<IChoice> = new Schema({
  type: {
    type: String,
    required: true,
  },
});

// Define the interface for a question
export interface IQuestion extends Document {
  question: string;
  choices: IChoice[];
  type: (typeof questionTypes)[number]; // Use typeof to ensure type safety with enum
  correctAnswers: string[];
  score: number;
  code?: string;
  image?: string;
}

const questionSchema: Schema<IQuestion> = new Schema({
  question: {
    type: String,
    required: true,
  },
  choices: [choiceSchema], // Use an array directly
  type: {
    type: String,
    enum: questionTypes,
    required: true,
  },
  correctAnswers: {
    type: [String],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  code: String,
  image: String,
});

// Define the interface for a topic
export interface ITopic extends Document {
  topic: string;
  level: string;
  totalQuestions: number;
  totalScore: number;
  totalTime: number;
  questions: IQuestion[];
}

const topicSchema: Schema<ITopic> = new Schema({
  topic: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  questions: [questionSchema], // Use an array directly
});

// Create the models
const Choice: Model<IChoice> = mongoose.model<IChoice>('Choice', choiceSchema);
const Question: Model<IQuestion> = mongoose.model<IQuestion>(
  'Question',
  questionSchema
);
const Topic: Model<ITopic> = mongoose.model<ITopic>('Topic', topicSchema);

export { Choice, Question, Topic };
