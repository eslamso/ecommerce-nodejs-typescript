import dotenv from "dotenv";
import "colors";
dotenv.config();
import dbConnection from "./config/dbConnection";
import app from "./app";
const dbUrl = process.env.DATA_BASE!;
dbConnection(dbUrl);
const port: number = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`the server is running on port ${port}`.bgBlue);
});
