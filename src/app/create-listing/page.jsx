import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        List Your Sneakers
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Sneaker Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="3"
            required
          />
          <input
            type="text"
            placeholder="Brand (e.g., Nike, Adidas)"
            className="border p-3 rounded-lg"
            id="brand"
            required
          />
          <input
            type="number"
            placeholder="Size (US)"
            className="border p-3 rounded-lg"
            id="size"
            min="1"
            max="18"
            required
          />
          <select id="condition" className="border p-3 rounded-lg" required>
            <option value="" disabled selected>
              Select Condition
            </option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
          </select>
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label htmlFor="regularPrice" className="text-sm font-semibold">
                Price ($)
              </label>
              <input
                type="number"
                id="regularPrice"
                min="1"
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="discountPrice" className="text-sm font-semibold">
                Discounted Price (Optional)
              </label>
              <input
                type="number"
                id="discountPrice"
                min="1"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-green-600 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            List Sneaker
          </button>
        </div>
      </form>
    </main>
  );
}
