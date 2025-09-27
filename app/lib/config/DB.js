import mongoose from "mongoose";
export const ConnectDB = async () => {
    await mongoose
      .connect(
        process.env.db_Url,{ useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then(() => console.log("connect db."));
};
