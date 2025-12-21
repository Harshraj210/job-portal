import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
    ],
  },
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
