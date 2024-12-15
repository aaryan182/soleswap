import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
      max: 18,
    },
    condition: {
      type: String,
      required: true,
      enum: ["new", "like-new", "used"],
    },
    description: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    discountPrice: {
      type: Number,
      min: 1,
    },
    imageUrls: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function (val) {
            return val.length <= 6;
          },
          message: "You can only upload up to 6 images.",
        },
      ],
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
export default Listing;
