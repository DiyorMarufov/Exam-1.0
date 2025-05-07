import { connect } from "mongoose";

export const mongoConnection = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log(`Mongo connected`);
  } catch (error) {
    console.error(`Error in connecting mongodb:`, error.message);
  }
};
