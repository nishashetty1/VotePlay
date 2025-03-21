import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  },
  logo: { 
    type: String, 
    required: true
  },
  count: { 
    type: Number, 
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export const IplTeams = mongoose.model("IplTeams", CategorySchema, "ipl_teams");
export const AiTools = mongoose.model("AiTools", CategorySchema, "ai_tools");
export const Browsers = mongoose.model("Browsers", CategorySchema, "browsers");
export const Cars = mongoose.model("Cars", CategorySchema, "cars");
export const FoodChains = mongoose.model("FoodChains", CategorySchema, "food_chains");
export const ProgrammingLanguages = mongoose.model("ProgrammingLanguages", CategorySchema, "programming_languages");
export const QuickCommerce = mongoose.model("QuickCommerce", CategorySchema, "quick_commerce");
export const SocialMedia = mongoose.model("SocialMedia", CategorySchema, "social_media");
export const StreetFoods = mongoose.model("StreetFoods", CategorySchema, "street_foods");
export const Influencers = mongoose.model("Influencers", CategorySchema, "influencers");

export const categoryModels = {
  'ipl_teams': IplTeams,
  'ai_tools': AiTools,
  'browsers': Browsers,
  'cars': Cars,
  'food_chains': FoodChains,
  'programming_languages': ProgrammingLanguages,
  'quick_commerce': QuickCommerce,
  'social_media': SocialMedia,
  'street_foods': StreetFoods,
  'influencers': Influencers
};