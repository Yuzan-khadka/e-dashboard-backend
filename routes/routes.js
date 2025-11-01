const express = require("express");

const router = express.Router();

const User = require("../models/User");
const Products = require("../models/Products");

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject(); //converting to an object so we could achieve the following result
    delete result.password; // to protect password visibility while sending response
    res.send(result);
    console.log("User created:", result);
  } catch (err) {
    console.error("Error creating user:", err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    if (req.body.password && req.body.email) {
      const user = await User.findOne(req.body).select("-password");
      if (user) {
        res.send(user);
      } else {
        res.send("User not found!!");
      }
    } else {
      res.send("User not found!!");
    }
  } catch (err) {
    console.error("Error fetching user:", err.message);
  }
});

router.post("/addproduct", async (req, res) => {
  try {
    const product = new Products(req.body);
    let result = await product.save();
    res.send(result);
    console.log("Product Added:", result);
  } catch (err) {
    console.error("Error adding product:", err.message);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Products.find();
    if (products.length > 0) {
      res.send(products);
      console.log("Products:", products);
    } else {
      res.send("No product found!!");
    }
  } catch (err) {
    console.error("Error fetching product:", err.message);
  }
});

router.delete("/product/:id", async (req, res) => {
  try {
    const product = await Products.deleteOne({ _id: req.params.id });
    res.send(product);
    console.log("Product deleted successfully:", product);
  } catch (err) {
    res.send(`Error deleting product: ${err.message}`);
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (product) {
      res.send(product);
    } else {
      throw new Error("Product not found!!");
    }
  } catch (err) {
    res.send(`Error finding product: ${err.message}`);
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Products.findByIdAndUpdate(
      { _id: id },
      updatedData,
      options
    );
    res.send(result);
    res.send("Product updated successfully!!");
  } catch (err) {
    res.send(`Error updating product: ${err.message}`);
  }
});

router.get("/search/:key", async (req, res) => {
  try {
    const result = await Products.find({
      $or: [
        {
          name: { $regex: req.params.key, $options: "i" },
        },
        {
          company: { $regex: req.params.key, $options: "i" },
        },
      ],
    });

    if (result.length === 0) {
      return res.status(200).json([]); // ✅ no products found, but still successful
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(`Error searching product: ${err.message}`);
  }
});

module.exports = router;
