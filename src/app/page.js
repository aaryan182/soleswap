import ListingItem from "@/components/ListingItem";
import Link from "next/link";

export default async function Home() {
  let latestSneakers = null;
  try {
    const result = await fetch(process.env.URL + "/api/listing/get", {
      method: "GET",
      cache: "no-store",
    });
    const data = await result.json();
    latestSneakers = data;
  } catch (error) {
    latestSneakers = { title: "Failed to load listing" };
  }

  let topOffers = null;
  try {
    const result = await fetch(process.env.URL + "/api/listing/get", {
      method: "GET",
      cache: "no-store",
    });
    const data = await result.json();
    topOffers = data;
  } catch (error) {
    topOffers = { title: "Failed to load offers" };
  }

  return (
    <div className=" text-white min-h-screen flex flex-col items-center">
      <div className="flex flex-col gap-6 p-10 sm:p-28 px-5 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-6xl font-bold text-white animate-fade-in">
          Step into the <span className="text-[#58E6FF]">extraordinary</span>
          <br /> Find your perfect sneakers here
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Welcome to SoleSwap – where every pair tells a story.
          <br /> From rare gems to fresh drops, redefine your sneaker game.
        </p>

        <Link
          href={"/search"}
          className="text-sm sm:text-base font-bold text-[#58E6FF] hover:underline hover:text-white transition-colors duration-300"
        >
          Start exploring...
        </Link>
        <img
          src="https://i.pinimg.com/736x/48/31/c9/4831c9c0d9982ce6a2a3bb8c9e1537ac.jpg"
          className="w-full h-[300px] sm:h-[550px] object-cover transform transition-transform duration-300 ease-in-out hover:rotate-x-12 hover:rotate-y-12 hover:scale-105"
          alt="Sneakers Banner"
        />
      </div>
      <div className="max-w-6xl mx-auto p-5 sm:p-10 flex flex-col gap-12 my-10 text-center">
        {topOffers && topOffers.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#58E6FF]">
                Top Offers
              </h2>
              <Link
                className="text-sm text-[#58E6FF] hover:underline hover:text-white transition-colors duration-300"
                href={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {topOffers.map((sneaker) => (
                <ListingItem sneaker={sneaker} key={sneaker.id} />
              ))}
            </div>
          </div>
        )}

        {latestSneakers && latestSneakers.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#58E6FF]">
                Latest Arrivals
              </h2>
              <Link
                className="text-sm text-[#58E6FF] hover:underline hover:text-white transition-colors duration-300"
                href={"/search?sort=created_at&order=desc"}
              >
                Show more sneakers
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {latestSneakers.map((sneaker) => (
                <ListingItem sneaker={sneaker} key={sneaker.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
