import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const { MONGODB_URL } = process.env;

const connect = async () => {
  console.log(MONGODB_URL);
  try {
    await mongoose.connect(MONGODB_URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log(`DB Connection Success`);
  } catch (err) {
    console.error(`DB Connection Failed`);
    console.error(err);
    process.exit(1);
  }
};

export default connect;
