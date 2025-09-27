import mongoose from "mongoose";
export const ConnectDB = async () => {
    await mongoose
      .connect(
        process.env.db_Url
      )
      .then(() => console.log("connect db."));
};
