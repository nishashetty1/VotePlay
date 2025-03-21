import React from 'react'
import { motion } from 'framer-motion'
import { SEO } from '.'

const ContactUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <>
      <SEO
        title='VotePlay | Contact Us'
        description="Contact information for VotePlay's Indian voting simulation platform."
        keywords='contact voteplay, voting simulator contact, get in touch'
        author='VotePlay'
        type='website'
      />
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='min-h-screen bg-gradient-to-b from-background-dark to-background-darker px-4 sm:px-6 lg:px-8 py-8'
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

        <motion.div
          variants={itemVariants}
          className='max-w-2xl mx-auto bg-background-card p-8 rounded-2xl shadow-xl border border-secondary/10'
        >
          <h1 className='text-3xl font-sanskrit text-primary mb-6'>
            Contact Us
          </h1>
          <p className='text-text-secondary text-sm mb-4'>
            Last updated on 25-01-2025 21:15:24
          </p>

          <div className='space-y-4 text-text-primary'>
            <p>You may contact us using the information below:</p>
            <div className='space-y-2'>
              <p>
                <span className='text-secondary'>
                  Merchant Legal entity name:
                </span>{' '}
                NISHA NAGRAJ SHETTY
              </p>
              <p>
                <span className='text-secondary'>Registered Address:</span>{' '}
                Wadala East, Sangam Nagar, Mumbai, Maharashtra, PIN: 400037
              </p>
              <p>
                <span className='text-secondary'>Operational Address:</span>{' '}
                Wadala East, Sangam Nagar, Mumbai, Maharashtra, PIN: 400037
              </p>
              <p>
                <span className='text-secondary'>Telephone No:</span> 9321486963
              </p>
              <p>
                <span className='text-secondary'>E-Mail ID:</span>{' '}
                voteplaysimulator@gmail.com
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default ContactUs
