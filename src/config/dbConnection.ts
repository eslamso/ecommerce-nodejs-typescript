import mongoose from "mongoose";

export default (url: string) => {
  mongoose
    .connect(url)
    .then((c) => {
      console.log(
        `data base connect does Successfully:${c.connection.host}`.bgGreen
      );
    })
    .catch((e) => {
      console.error(`failed to connect to data base: ${e}`.bgRed);
      process.exit(1);
    });
};
