const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// add book to favorites
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res
        .status(200)
        .json({ message: "Book is already in the favourites" });
    }
    userData.favourites.push(bookid); // Push directly to userData
    await userData.save();
    return res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while adding book to favourite" });
  }
});

// delete book from favorites
router.put("/remove-book-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      // userData.favourites.pull(bookid); // Use pull method to remove
      // await userData.save();

      await User.findByIdAndUpdate(id, {$pull:{favourites:bookid}});
      
      return res.status(200).json({ message: "Book removed from favourites" });
    }
    return res.status(400).json({ message: "Book not found in favourites" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "An error occurred while removing book from the favourite",
      });
  }
});


router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    console.log("User ID:", id); // Log the user ID from headers

    const userData = await User.findById(id).populate("favourites");
    if (!userData) {
      console.log("User not found"); // Log if user not found
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Favourite books:", userData.favourites); // Log the favourites
    return res.json({ status: "Success", data: userData.favourites });
  } catch (error) {
    console.error("Error:", error); // Log the error message
    return res
      .status(500)
      .json({ message: "An error occurred showing books from the favourite" });
  }
});


module.exports = router;
