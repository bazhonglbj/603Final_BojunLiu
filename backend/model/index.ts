import mongoose from "mongoose";
import bookSchema from "./bookModel";
import borrowSchema from "./borrowModel";
import categorySchema from "./categoryModel";
import userSchema from "./userModel";

const uri = "mongodb+srv://bazhonglbj:ojmDGCaIiDgjTuzQ@cluster0.kv6tjtb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

async function main() {
  await mongoose.connect(uri);
}

main()
  .then((res) => {
    console.log("mongodb connected success");
  })
  .catch((err) => {
    console.log("mongodb connected fail");
    console.log(err)
  });

const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Borrow = mongoose.model("Borrow", borrowSchema);

export { Borrow, Book, User, Category };