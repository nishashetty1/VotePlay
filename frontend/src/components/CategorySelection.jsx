import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Vote, ChartBar, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { usePaymentStore } from '../store/paymentStore';
import { SEO } from '.';
import { getAuthToken } from '../utils/auth';

const categories = [
  {
    id: 'ai_tools',
    name: 'AI Tools',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741800909/ai_tools_youqcs.png',
    description: 'Choose the AI tool that impresses you most'
  },
  {
    id: 'cars',
    name: 'Cars',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741804188/cars_qopvv7.webp',
    description: 'Vote for your favourite car'
  },
  {
    id: 'food_chains',
    name: 'Food Chains',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741804355/food_chains_gm5cpk.jpg',
    description: 'Choose your favorite food chain'
  },
  {
    id: 'influencers',
    name: 'Influencers',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741841124/influencers_nxbnh2.jpg',
    description: 'Choose your favorite influencer'
  },
  {
    id: 'ipl_teams',
    name: 'IPL Teams',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741800908/ipl_s5xgz4.jpg',
    description: 'Vote for your favorite IPL team'
  },
  {
    id: 'programming_languages',
    name: 'Programming Languages',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741804598/programming_languages_be2oon.webp',
    description: 'Vote for your preferred programming language'
  },
  {
    id: 'quick_commerce',
    name: 'Quick Commerce',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741840821/quick_commerces_luq94y.jpg',
    description: 'Select your go-to quick commerce platform'
  },
  {
    id: 'social_media',
    name: 'Social Media',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741804889/social_media_llevhl.jpg',
    description: 'Pick your favorite social media platform'
  },
  {
    id: 'street_foods',
    name: 'Street Foods',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741805407/street_foods_egmlld.jpg',
    description: 'Vote for your favorite street food'
  },
  {
    id: 'browsers',
    name: 'Web Browsers',
    icon: 'https://res.cloudinary.com/dftncwphd/image/upload/v1741804117/web_browsers_ehnseu.jpg',
    description: 'Pick your preferred web browser'
  }
];

const CategorySelection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { votecoins, updateVotecoins } = usePaymentStore();

  const resultsRef = useRef(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowResults(false);
    setCategoryData([]);
  };

  const handleVote = async () => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }

    if (votecoins < 5) {
      alert('You need at least 5 VoteCoins to vote. Please purchase more VoteCoins.');
      return;
    }

    try {
      const success = await updateVotecoins(5, 'subtract');
      if (success) {
        useStore.getState().setSelectedCategory(selectedCategory);
        useStore.getState().setIsVoting(true);
        await useStore.getState().fetchTeams(selectedCategory.id);
        navigate('/votenow');
      } else {
        throw new Error('Failed to process vote');
      }
    } catch (error) {
      console.error('Error processing vote:', error);
      alert('Failed to process vote. Please try again.');
    }
  };

  const handleViewResults = async () => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }

    if (votecoins < 10 && !showResults) {
      alert('You need at least 10 VoteCoins to view results.');
      return;
    }

    try {
      setIsLoading(true);
      if (!showResults) {
        const success = await updateVotecoins(10, 'subtract');
        if (!success) {
          throw new Error('Failed to process payment');
        }
      }

      if (!showResults) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/category/${selectedCategory.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch results');
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setCategoryData(data);
          setShowResults(true);
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          throw new Error('No results found for this category');
        }
      } else {
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error viewing results:', error);
      alert(error.message || 'Failed to load results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (selectedCategory && showResults) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/category/${selectedCategory.id}`,
            {
              headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch results');
          }

          const data = await response.json();
          if (Array.isArray(data)) {
            setCategoryData(data);
          }
        } catch (error) {
          console.error('Error fetching category data:', error);
          alert('Failed to load results. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategoryData();
  }, [selectedCategory, showResults]);

  return (
    <>
      <SEO
        title="VotePlay | Categories"
        description="Choose a category to cast your vote"
        keywords="voting categories, ipl teams, ai tools, browsers, cars, food chains"
        author="VotePlay"
        type="website"
        image="https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp"
      />

      <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-dark px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-fixed bg-cover" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-sanskrit text-center text-text-primary mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Select a Category
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ y: -5 }}
                onClick={() => handleCategorySelect(category)}
                className="relative aspect-[16/12] cursor-pointer group"
              >
                <div
                  className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-300
                    ${selectedCategory?.id === category.id
                      ? 'ring-2 ring-accent shadow-lg shadow-accent/20'
                      : 'hover:ring-2 hover:ring-accent/50'}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                    style={{ backgroundImage: `url(${category.icon})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background-darker/95 via-background-darker/70 to-background-darker/30" />
                </div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-primary/90">
                      {category.description}
                    </p>
                  </div>

                  {selectedCategory?.id === category.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="text-xs text-text-secondary text-center bg-background-darker/80 
                        backdrop-blur-sm rounded-full py-2 px-3 flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-accent" />
                        <span>
                          Cast Vote: 5 VoteCoins • View Results: 10 VoteCoins
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleVote}
                          className="w-full py-2 bg-primary hover:bg-primary-dark rounded-full text-text-primary 
                            text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={votecoins < 5}
                        >
                          <Vote className="w-4 h-4" />
                          Cast Your Vote
                          {votecoins < 5 && (
                            <span className="text-xs bg-background-darker/50 px-2 py-0.5 rounded-full">
                              ({5 - votecoins} VC needed)
                            </span>
                          )}
                        </button>

                        <button
                          onClick={handleViewResults}
                          className="w-full py-2 bg-accent hover:bg-accent/90 rounded-full text-background-dark 
                            text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || (!showResults && votecoins < 10)}
                        >
                          {showResults ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          {isLoading
                            ? "Loading..."
                            : showResults
                              ? "Hide Results"
                              : "View Results"}
                          {!showResults && votecoins < 10 && (
                            <span className="text-xs bg-background-darker/20 px-2 py-0.5 rounded-full">
                              ({10 - votecoins} VC needed)
                            </span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Results Section */}
          {showResults && categoryData.length > 0 && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-16 bg-background-card/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden 
                border border-accent/20"
            >
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-sanskrit text-center text-text-primary mb-8">
                  Results for {selectedCategory.name}
                </h2>

                {/* Top 3 Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8">
                  {categoryData
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)
                    .map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative bg-background-darker/80 rounded-xl p-6 border border-accent/20
                          backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full
                          flex items-center justify-center text-background-dark font-bold shadow-lg
                          ${index === 0
                            ? 'bg-yellow-400'
                            : index === 1
                              ? 'bg-gray-300'
                              : 'bg-amber-600'}`}
                        >
                          #{index + 1}
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={item.logo}
                            alt={item.name}
                            className={`w-24 h-24 object-contain rounded-lg p-2
                               ${(
                                item.name === 'None of the Above' ||
                                item.name === 'ChatGPT' ||
                                item.name === 'DeepL' ||
                                item.name === 'Midjourney' ||
                                item.name === 'Runway' ||
                                item.name === 'Rust'
                              ) ? 'filter invert ' : ''
                              }`}
                          />
                          <h4 className="text-lg font-bold text-text-primary text-center">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                            <ChartBar className="w-5 h-5 text-accent" />
                            <span className="text-2xl font-bold text-accent">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* Other Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categoryData
                    .sort((a, b) => b.count - a.count)
                    .slice(3)
                    .map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-background-darker/60 rounded-xl p-4 border border-accent/20"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.logo}
                            alt={item.name}
                            className={`w-12 h-12 object-contain rounded-lg p-1.5 ${(item.name === 'None of the Above' ||
                                item.name === 'ChatGPT' ||
                                item.name === 'DeepL' ||
                                item.name === 'Midjourney' ||
                                item.name === 'Runway' ||
                                item.name === 'Rust'
                              ) ? 'filter invert' : ''
                              }`}
                          />
                          <div>
                            <h4 className="text-sm font-medium text-text-primary">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <ChartBar className="w-4 h-4 text-accent" />
                              <span className="font-bold text-accent">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CategorySelection;