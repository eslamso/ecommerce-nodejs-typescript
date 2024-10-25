import fs from "fs";
import "colors";
import Product from "../../models/product.model";
import dbConnection from "../../config/dbConnection";

dbConnection(
  "mongodb+srv://eslamTarek:33665599@cluster0.tgytazs.mongodb.net/express-ts-ecommerce?retryWrites=true&w=majority"
);

// Read data
const products = JSON.parse(fs.readFileSync("./products.json").toString());

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// npx ts-node seeder.ts -d/-i
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
