const router = require("express").Router();
// const cors = rget-book-by-id/:idequire("cors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");
const { application } = require("express");


// add book --admin
router.post("/Profile/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You do not have access to perform the admin work" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.description,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in the admin section" });
  }
});

// update book
router.put("/Profile/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;

    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.description,
      language: req.body.language,
    });
  return  res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while updating the book" });
  }
});

// delete book
router.delete("/delete-book", authenticateToken, async(req, res)=>{
try {
    const {bookid} = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({message:"Book deleted successfully"});
} catch (error) {
  res.status(500).json({message:"Error occurred while deleting the book."})
}
});


// public api startedf
// get all books
router.get("/get-all-books", async(req,res)=>{
  try {
    const books = await Book.find().sort({createdAt:-1});
    res.status(200).json({data:books});
  } catch (error) {
    res.status(500).json({message:"Getting all books failed"})
  }
})

// get recently added books limit 4
router.get("/get-recent-books", async(req,res)=>{
  try {
    const books = await Book.find().sort({createdAt:-1}).limit(4);
    res.status(200).json({status:"Success",
      data:books});
      
  } catch (error) {
    res.status(500).json({message:"Getting recently added books failed"})
  }
  
})

// get book by id
router.get("/get-book-by-id/:id", async(req,res)=>{
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    return res.json({message:"getting book by id successful", data: book})
  } catch (error) {
    res.status(500).json({message:"Getting book by id  failed"})
  }
})


module.exports = router;
