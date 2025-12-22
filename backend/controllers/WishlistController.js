import Wishlist from "../models/WishlistModel";

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { companyId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, company: [companyId] });
      return res.status(201).json({ message: "Company added to wishlist" });
    }
    const companyExists = wishlist.company.includes(companyId);
    if (companyExists) {
      wishlist.company.pull(companyId);
      await wishlist.save();
      return res.status(200).json({ message: "Company removed from wishlist" });
    } else {
      wishlist.company.push(companyId);
      await wishlist.save();
      return res.status(200).json({ message: "Company added to wishlist" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default addToWishlist;
