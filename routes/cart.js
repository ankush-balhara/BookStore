const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book"); // Ensure to import the Book model
const { authenticateToken } = require("./userAuth");

// Add a book to the cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);

    if (isBookInCart) {
      return res.status(200).send("Book is already in cart");
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    res.status(200).send("Book added to cart");
  } catch (error) {
    console.error("Error adding book to cart:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while adding book to the cart" });
  }
});

// Remove a book from the cart
router.put("/remove-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.body;
    const { id } = req.headers;

    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);

    if (!isBookInCart) {
      return res.status(400).json({ message: "Book not found in cart" });
    }

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error("Error removing book from cart:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while removing book from the cart" });
  }
});


// Get a user's cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Make sure 'id' is correctly passed in headers
    const userData = await User.findById(id).select("cart");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the book documents from the Book collection using the book IDs in the cart array
    const cartItems = await Book.find({ _id: { $in: userData.cart } });

    return res.json({
      status: "Success",
      data: cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart data:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while getting the cart data" });
  }
});

module.exports = router;

