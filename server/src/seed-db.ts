// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { Topic, ITopic } from '@/database/models/quizQuestionSchema';

// dotenv.config();

// async function seedDatabase(topicData: ITopic) {
//   try {
//     // Connect to the MongoDB database
//     await mongoose.connect(process.env.MONGO_URL!, {
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true,
//     });

//     // Clear the existing data
//     await Topic.deleteMany({ topic: topicData.topic });

//     // Insert the new data
//     await Topic.create(topicData);

//     console.log('Database seeded successfully!');
//     // Close the connection
//     await mongoose.connection.close();
//   } catch (error) {
//     console.error('Error seeding the database:', error);
//   }
// }

// // Define the structure of topicData (replace with actual interface)
// // const javascript: ITopic = {
// // topic: 'JavaScript',
// // level: 'Beginner',
// // totalQuestions: 10,
// // totalScore: 100,
// // totalTime: 30,
// // questions: [
// //   // Define your questions here
// // ],
// // };

// // Seed the database with the JavaScript topic
// seedDatabase(javascript);
