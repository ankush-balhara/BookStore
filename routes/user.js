const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken}  = require("./userAuth");

// sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // check username length is more than 4
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 4" });
    }

    // check if username already exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // check if email already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // check password length
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password's length should be greater than 5" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    // new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });

    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // please enter username
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const existingUser = await User.findOne({ username: username });
      // username doesn't exist
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // password matching
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (isMatch) {
      const authClaims = [
        { name: existingUser.username },
        { role: existingUser.role },
      ];
      const token = jwt.sign({ authClaims }, "bookstore123", {
        expiresIn: "30d",
      });

        return res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

// get user information
router.get("/get-user-info",authenticateToken, async (req, res) => {
  try {
    const {id} = req.headers;
    console.log("Received ID:", id);
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message:"Internal token server error"})
  }
});
  
// update address
router.put("/update-address",authenticateToken, async (req, res) => {
  try {
    const {id} = req.headers;
    const {address} = req.body;

    await User.findByIdAndUpdate(id,{address:address});
    return res.status(200).json({message:"Address updated successfully"})
  } catch (error) {
    res.status(500).json({message:"update section problem Internal error"})
  }
})
// module.exports = router;
module.exports = router; // Fix the typo


