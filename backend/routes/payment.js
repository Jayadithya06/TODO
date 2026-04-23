const express = require('express')
const router = express.Router()
const Razorpay = require('razorpay')
const crypto = require('crypto')
const authMiddleware = require('../middleware/auth')

const razorpay = new Razorpay({
  key_id: 'rzp_test_SgEFBG2MzKQCn0',
  key_secret: 'aLqOnJTpw4AkpMKuJOKyPKPY'
})

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 49900,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/verify', authMiddleware, (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  const sign = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSign = crypto
    .createHmac('sha256', 'aLqOnJTpw4AkpMKuJOKyPKPY')
    .update(sign)
    .toString('hex')

  if (expectedSign === razorpay_signature) {
    res.json({ message: 'Payment verified successfully' })
  } else {
    res.status(400).json({ message: 'Payment verification failed' })
  }
})

module.exports = router