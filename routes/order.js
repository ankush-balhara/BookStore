const router = require("express").Router(); 
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuth");

// place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orders } = req.body; // Change req.headers to req.body

    for (const orderData of orders) {
      const newOrder = new Order({
        user: id,
        book: orderData._id,
      });
      const orderDataFromDb = await newOrder.save();

      // saving order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id }, // Changed cart to orders
      });

      // clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id }, // Using the book ID to clear the cart
      });
    }
    return res.json({
      status: "Success",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error placing order:", error); // Better logging for debugging
    return res.status(500).json({ message: `Error in the order section: ${error.message}` });
  }
});

// order history
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Fetch the user by ID and populate the 'orders' field
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: {
        path: "book",
      },
    });

    if (!userData) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    const orderData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({
      message: "An error occurred while getting the order history data",
    });
  }
});

// // get-all-orders --admin
router.get("/Profile/all-orders",authenticateToken, async(req,res)=>{
    try {
        const userData = await Order.find()
        .populate({
            path:"book",
        }).populate({
            path:"user",
        }).sort({
            createdAt:-1
        })
        return res.json({
            status:"Success",
            data:userData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Error occures while getting all orders of the users"
        });
    }
});

// update order --admin
router.put("/update-status/:id", authenticateToken, async(req,res)=>{
    try {
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status: req.body.status});
        return res.json({
            status:"Success",
            message:"Order status updated successfully"
});
    } catch (error) {
       console.log(error);
       return res.status(500).json({message:"Error occured in the Update status from admin side"});
    }
});



module.exports = router;
