import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    otp: {
      code: String,
      expiry: Date,
    },
    votecoins: {
      type: Number,
      default: 15,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    voted: {
      type: Number,
      default: 0,
    },
    image: {
      public_id: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      }
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

export const User = mongoose.model("User", UserSchema);
