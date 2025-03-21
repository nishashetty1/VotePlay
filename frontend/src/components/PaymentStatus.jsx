import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePaymentStore } from '../store/paymentStore'
import { getAuthToken } from '../utils/auth'
import { motion } from 'framer-motion'

const PaymentStatus = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { updateVotecoins, fetchVotecoins } = usePaymentStore()
  const [status, setStatus] = useState('processing')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id')
        const credits = sessionStorage.getItem('pending_credits')
        const token = getAuthToken()

        console.log('Payment verification:', { orderId, credits })

        if (!orderId || !credits || !token) {
          console.error('Missing required data:', {
            orderId,
            credits,
            hasToken: !!token
          })
          setStatus('failed')
          setTimeout(() => navigate('/dashboard'), 2000)
          return
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/payment/verify/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Payment verification failed: ${response.status}`)
        }

        const data = await response.json()
        console.log('Payment verification response:', data)

        if (data.success && data.status === 'PAID') {
          await updateVotecoins(Number(credits), 'add')
          await fetchVotecoins()
          setStatus('success')
        } else {
          setStatus('failed')
        }

        sessionStorage.removeItem('pending_credits')

        setTimeout(() => navigate('/dashboard'), 2000)
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        sessionStorage.removeItem('pending_credits')
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    }

    verifyPayment()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  const statusVariants = {
    processing: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: 'linear' }
    },
    success: { scale: [1, 1.2, 1], transition: { duration: 0.5 } },
    failed: { x: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-background-dark to-background-darker relative'>
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='relative bg-background-card p-8 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm max-w-md w-full mx-4'
      >
        <motion.div
          className='text-center space-y-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className='text-3xl font-sanskrit text-text-primary'>
            {status === 'processing' && 'Verifying Payment...'}
            {status === 'success' && '🎉 Payment Successful!'}
            {status === 'failed' && '❌ Payment Failed'}
          </h2>

          {status === 'processing' && (
            <motion.div
              variants={statusVariants}
              animate='processing'
              className='flex justify-center'
            >
              <div className='h-12 w-12 border-4 border-primary border-t-transparent rounded-full' />
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              variants={statusVariants}
              animate='success'
              className='space-y-4'
            >
              <p className='text-text-primary text-lg'>
                VoteCoins have been added to your account!
              </p>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              variants={statusVariants}
              animate='failed'
              className='space-y-4'
            >
              <p className='text-text-primary text-lg'>
                Payment verification failed.
              </p>
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-primary/20'
              >
                Return to Dashboard
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
          <div className='absolute top-5 left-5 w-20 h-20 bg-primary/5 rounded-full blur-xl' />
          <div className='absolute bottom-5 right-5 w-20 h-20 bg-secondary/5 rounded-full blur-xl' />
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentStatus
