import { useState } from 'react'
import API from './api'

export default function Payment() {
  const [message, setMessage] = useState('')

  const handlePayment = async () => {
    try {
      const order = await API.post('/payment/create-order')
      const options = {
        key: 'rzp_test_SgEFBG2MzKQCn0',
        amount: order.data.amount,
        currency: 'INR',
        name: 'TO-DO',
        description: 'Upgrade to Pro — unlimited tasks',
        order_id: order.data.id,
        handler: async (response) => {
          const res = await API.post('/payment/verify', response)
          setMessage(res.data.message)
        },
        prefill: { name: 'Jayadithya' },
        theme: { color: '#2C3B1F' }
      }
      const razor = new window.Razorpay(options)
      razor.open()
    } catch (err) {
      setMessage('Payment failed — try again')
    }
  }

  return (
    <div className="payment-box">
      <h2>Upgrade to Pro</h2>
      <p>Unlock unlimited tasks, priority support, and advanced analytics.</p>
      <button className="payment-btn" onClick={handlePayment}>Pay ₹499 / month</button>
      {message && (
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#B8C4A8' }}>{message}</p>
      )}
    </div>
  )
}