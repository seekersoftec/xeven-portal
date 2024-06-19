import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  // Connect to MongoDB
  mongoose
    .connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('NOT CONNECTED TO NETWORK', err));
}
