require('dotenv').config();
const Order = require('../Models/OrderSchema.js');
const AllNumberSchema=require('../Models/AllNumberModel.js')
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: process.env.HOST,  
  port: process.env.SMTP_PORT,                
  secure: true,           
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.find();
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postOrder = async (req, res) => {
  try {
    const createOrder = await Order.create(req.body);

    const { customerEmail, customerName, cartItems, totalPrice, phoneNumber } = createOrder;

    if (!customerEmail) {
      return res
        .status(400)
        .json({ error: "Customer email is required to send confirmation." });
    }

    
    const existingNumber = await AllNumberSchema.findOne({ phoneNumber });

    if (!existingNumber) {
      await AllNumberSchema.create({ phoneNumber });
     
    } 
    const orderDetails = `
      <h2>Order Confirmation</h2>
      <p>Hi <b>${customerName}</b>,</p>
      <p>Thank you for Shopping in BlinkIt. Here are the details:</p>
      <p>We may contact you on your phone number for any further query: <b>${phoneNumber}</b></p>
      <ul>
        ${cartItems
          .map(
            (item) =>
              `<li>${item.productName} - ${item.quantity} x $${item.selectedVariant?.price}</li>`
          )
          .join("")}
      </ul>
      <p><b>Total Amount:</b> $${totalPrice}</p>
      <p>We’ll notify you once your order is shipped.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: "Yeah!!! Your Order has been placed Successfully!!",
      html: orderDetails,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "adnansiddiqui12098@gmail.com",
      subject: `New Order from ${customerName}`,
      html: `
        <h2>New Order Placed</h2>
        <p><b>Customer:</b> ${customerName} (${customerEmail})</p>
        <p><b>Phone:</b> ${phoneNumber}</p>
        <p><b>Total:</b> $${totalPrice}</p>
        <h3>Items:</h3>
        <ul>
          ${cartItems
            .map(
              (item) =>
                `<li>${item.productName} - ${item.quantity} x $${item.selectedVariant?.price}</li>`
            )
            .join("")}
        </ul>
      `,
    });

    res.status(201).json({
      message: "Order placed successfully & email sent via SMTP!",
      data: createOrder,
    });
  } catch (error) {
    console.error("Error in postOrder:", error);
    res
      .status(500)
      .json({ error: error.message, data: process.env.SMTP_USER });
  }
};

exports.GetUserOrders= async (req, res) => {
  try {
    const { email } = req.params;
     

    const orders = await Order.find({ postedBy: email });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};