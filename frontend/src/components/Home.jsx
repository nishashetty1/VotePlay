import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FunFact, LogoutButton, SEO } from '.'
import { isAuthenticated } from '../utils/auth'

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <>
      <SEO
        title='VotePlay | Home'
        description='Experience realistic Indian electoral process simulation. Learn about EVM voting, voter ID cards, and democratic participation through interactive simulation.'
        keywords='Indian voting simulation, EVM demo, voter education, electoral process, democratic simulation, digital voting practice, voter ID simulation, electoral literacy'
        author='VotePlay'
        type='website'
        image='https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp'
      />
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='min-h-screen bg-gradient-to-b from-background-dark to-background-darker'
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

        {/* Logout Button */}
        {isAuthenticated() && <LogoutButton />}

        <div className='relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col items-center justify-center min-h-screen'>
          <motion.div
            variants={containerVariants}
            className='max-w-4xl w-full space-y-8 sm:space-y-12 lg:space-y-16 text-center'
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className='space-y-4 sm:space-y-6'
            >
              <div className='relative'>
                <motion.h1
                  variants={itemVariants}
                  className='relative text-5xl sm:text-5xl md:text-7xl font-sanskrit text-primary mb-4 sm:mb-6 leading-tight tracking-tight'
                >
                  VotePlay 🇮🇳
                </motion.h1>
              </div>
              <motion.p
                variants={itemVariants}
                className='text-lg sm:text-xl md:text-2xl text-text-primary font-body leading-relaxed max-w-3xl mx-auto font-light'
              >
                Immerse yourself in the world's largest democratic process
                through an interactive and educational simulation.
              </motion.p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='relative group'
            >
              <div className='relative w-full'>
                <Link
                  to={isAuthenticated() ? '/video' : '/login'}
                  className='inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-body font-semibold text-text-primary bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full transition-all duration-300 transform hover:-translate-y-0.5'
                >
                  <div className='mr-2 text-xl sm:text-2xl'>🗳️</div>
                  {isAuthenticated()
                    ? 'Continue Simulation'
                    : 'Start Simulation'}
                </Link>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              variants={itemVariants}
              className='mt-6 p-6 sm:p-8 bg-background-card rounded-2xl shadow-xl border border-secondary/10 backdrop-blur-sm'
            >
              <h2 className='text-md sm:text-2xl font-sanskrit text-text-primary mb-4 sm:mb-6'>
                For Educational Purposes Only.
                <p className='font-body text-sm mt-6'>
                  Experience the EVM and VVPAT system like never before.{' '}
                  <span>
                    Understand the process of India's voting system in an
                    interactive way!
                  </span>
                </p>
              </h2>
              <p className='text-base sm:text-lg text-text-primary font-body mb-4 leading-relaxed'>
                Learn more about{' '}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className='inline-block'
                >
                  <a
                    href='https://www.eci.gov.in/evm'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-accent hover:text-accent-light transition-colors duration-300'
                  >
                    EVM
                  </a>
                </motion.span>{' '}
                and
                <span className='text-accent font-medium'> VVPAT</span> by
                visiting:
              </p>
              <a
                href='https://www.eci.gov.in/evm'
                target='_blank'
                rel='noopener noreferrer'
                className='text-secondary hover:text-secondary-dark transition-colors duration-300 text-sm sm:text-base break-all'
              >
                https://www.eci.gov.in/evm
              </a>

              {/* Note Section */}
              <div className='mt-6 p-4 sm:p-5 bg-background-darker rounded-lg border border-gray-800/50'>
                <p className='text-text-secondary text-sm sm:text-base font-body leading-relaxed'>
                  <strong className='text-primary font-medium'>Note:</strong>{' '}
                  This simulator is designed to help users understand the basic
                  principles of voting using EVM and VVPAT.
                </p>
              </div>

              <FunFact />
            </motion.div>
          </motion.div>

          {/* Added decoration */}
          <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
            <div className='absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl' />
            <div className='absolute bottom-10 right-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl' />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Home
