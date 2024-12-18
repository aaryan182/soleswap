import Listing from "../../../../lib/models/listing.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";

export const POST = async (req) => {
  await connect();
  const data = await req.json();
  try {
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === "asc" ? 1 : -1;

    let brand = data.brand;
    if (!brand || brand === "all") {
      brand = { $exists: true }; 
    }

    let condition = data.condition;
    if (!condition || condition === "all") {
      condition = { $in: ["new", "like-new", "used"] };
    }

    let size = data.size;
    if (!size || size === "all") {
      size = { $exists: true }; 
    }

    let minPrice = parseFloat(data.minPrice) || 0;
    let maxPrice = parseFloat(data.maxPrice) || Number.MAX_SAFE_INTEGER;

    const listings = await Listing.find({
      ...(data.userId && { userRef: data.userId }), 
      ...(data.listingId && { _id: data.listingId }), 
      ...(data.searchTerm && {
        $or: [
          { name: { $regex: data.searchTerm, $options: "i" } },
          { description: { $regex: data.searchTerm, $options: "i" } },
          { brand: { $regex: data.searchTerm, $options: "i" } },
        ],
      }),
      brand,
      condition,
      size,
      regularPrice: { $gte: minPrice, $lte: maxPrice }, 
    })
      .sort({ updatedAt: sortDirection }) 
      .skip(startIndex) 
      .limit(limit); 

    return new Response(JSON.stringify(listings), {
      status: 200,
    });
  } catch (error) {
    console.error("Error getting sneaker listings:", error);
    return new Response("Error fetching listings", { status: 500 });
  }
};
