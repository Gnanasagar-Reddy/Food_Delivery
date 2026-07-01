import usermodel from "../models/usermodel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.body.ItemId;
    const user = await usermodel.findById(userId);

    // Update the local object
    user.cartdata[itemId] = (user.cartdata[itemId] || 0) + 1;
    
    await user.save();  

    res.json({
      success: true,
      message: "Added to cart",
      cartdata: user.cartdata
    });   
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.body.ItemId; 
    const user = await usermodel.findById(userId);

    if (user.cartdata[itemId] > 0) {
      user.cartdata[itemId] -= 1;
      if (user.cartdata[itemId] === 0) delete user.cartdata[itemId];
      await user.save();
    }

    res.json({ success: true, cartdata: user.cartdata });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const getCart = async (req, res) => {
  try {
    console.log("req.userId:", req.userId);

    const user = await usermodel.findById(req.userId);

    console.log("user:", user);

    res.json({
      success: true,
      cartdata: user.cartdata || {}
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export { addToCart, removeFromCart, getCart };