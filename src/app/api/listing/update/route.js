import Listing from "../../../../lib/models/listing.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";
import { currentUser } from "@clerk/nextjs/server";
export const POST = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();
    if (!user || user.publicMetadata.userMogoId !== data.userMongoId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const newListing = await Listing.findByIdAndUpdate(
      data.listingId,
      {
        $set: {
          name: data.name,
          brand: data.brand,
          size: data.size,
          condition: data.condition,
          description: data.description,
          regularPrice: data.regularPrice,
          discountPrice: data.discountPrice,
          imageUrls: data.imageUrls,
        },
      },
      { new: true }
    );
    await newListing.save();
    return new Response(JSON.stringify(newListing), {
      status: 200,
    });
  } catch (error) {
    console.log("Error creating listing:", error);
    return new Response("Error creating listing", {
      status: 500,
    });
  }
};
