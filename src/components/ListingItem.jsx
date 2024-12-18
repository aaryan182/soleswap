import Link from "next/link";
import { MdLocalOffer } from "react-icons/md";
export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link href={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://via.placeholder.com/300x300?text=No+Image+Available"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
          </p>
          {listing.offer && (
            <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
              <MdLocalOffer className="h-4 w-4" />
              Special Offer
            </div>
          )}
          <div className="text-slate-700 flex gap-4 mt-2">
            <div className="font-bold text-xs">{listing.brand}</div>
            <div className="font-bold text-xs">Size: {listing.size}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
