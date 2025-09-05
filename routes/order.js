const express = require("express");
const orderRouter = express.Router();
const Order = require("../models/order");

//post router for creating order
orderRouter.post("/orders", async (req, res) => {
  try {
    const {
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice,
      quantity,
      category,
      image,
      buyerId,
      vendorId,
    } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !productName || !productPrice || !quantity || !buyerId || !vendorId) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['fullName', 'email', 'productName', 'productPrice', 'quantity', 'buyerId', 'vendorId']
      });
    }
    
    const order = new Order({
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice: Number(productPrice),
      quantity: Number(quantity),
      category,
      image,
      buyerId,
      vendorId
      // createdAt will be automatically set by the model default
    });
    
    await order.save();
    res.status(201).json({
      message: 'Order created successfully!',
      order: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

//get route for fetching orders by buyers ID

orderRouter.get("/orders/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;
    const orders = await Order.find({ buyerId: buyerId }).sort({ createdAt: -1 });
    
    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this buyer'
      });
    }
    
    res.status(200).json({
      message: 'Orders fetched successfully!',
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});


//delete route for deleting a specific order by the id

orderRouter.delete("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order deleted successfully!',
      order: deletedOrder
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

//update delivery order status
orderRouter.patch("/vendor/orders/:orderId/delivered", async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { 
        delivered: true,
        processing: false 
      }, 
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order marked as delivered successfully!',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

orderRouter.patch("/vendor/orders/:orderId/processing", async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { 
        processing: true,
        delivered: false 
      }, 
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order marked as processing successfully!',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

orderRouter.patch("/vendor/orders/:orderId/cancel", async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { 
        canceled: true,
        processing: false,
        delivered: false
      }, 
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order marked as canceled successfully!',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});


//get route for fetching orders by vendor ID

orderRouter.get("/vendor/orders/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ vendorId: vendorId }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this vendor'
      });
    }

    res.status(200).json({
      message: 'Orders fetched successfully!',
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = orderRouter;
