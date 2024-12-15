"use client";
import { useState } from "react";
import { app } from "../../firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default function CreateListing() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    brand: "",
    description: "",
    size: 0,
    condition: "",
    regularPrice: 50,
    discountPrice: 0,
  });

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      const promises = files.map((file) => storeImage(file));
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, ...urls],
          });
          setImageUploadError(false);
        })
        .catch(() =>
          setImageUploadError("Image upload failed (max 2MB per image).")
        )
        .finally(() => setUploading(false));
    } else {
      setImageUploadError("You can upload a maximum of 6 images.");
    }
  };

  const storeImage = (file) =>
    new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const storageRef = ref(storage, `${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        () => {},
        (err) => reject(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      setError("At least one image is required.");
      return;
    }
    if (Number(formData.discountPrice) >= Number(formData.regularPrice)) {
      setError("Discount price must be lower than the regular price.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userMongoId: user.publicMetadata.userMogoId,
        }),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to create listing.");
      router.push(`/listing/${result._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded)
    return <h1 className="text-center my-7 font-semibold">Loading...</h1>;
  if (!isSignedIn)
    return (
      <h1 className="text-center my-7 font-semibold">
        You must sign in to list sneakers.
      </h1>
    );

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        List Your Sneakers
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            id="name"
            placeholder="Sneaker Name"
            className="border p-3 rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="brand"
            placeholder="Brand (e.g., Nike, Adidas)"
            className="border p-3 rounded-lg"
            value={formData.brand}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="size"
            placeholder="Size (US)"
            className="border p-3 rounded-lg"
            value={formData.size}
            onChange={handleChange}
            min="1"
            max="18"
            required
          />
          <select
            id="condition"
            className="border p-3 rounded-lg"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Condition
            </option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
          </select>
          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="flex gap-4">
            <input
              type="number"
              id="regularPrice"
              placeholder="Price ($)"
              className="border p-3 rounded-lg"
              value={formData.regularPrice}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              id="discountPrice"
              placeholder="Discount Price (Optional)"
              className="border p-3 rounded-lg"
              value={formData.discountPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <p>
            Images:{" "}
            <span className="text-gray-600 text-sm">
              First image will be the cover (max 6).
            </span>
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="p-3 border rounded-lg"
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            disabled={uploading}
            className="p-3 text-green-700 border border-green-700 rounded uppercase disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
          {formData.imageUrls.map((url, idx) => (
            <div key={url} className="flex items-center gap-2">
              <img
                src={url}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </form>
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-blue-600 text-white rounded mt-4"
      >
        {loading ? "Creating Listing..." : "Create Listing"}
      </button>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </main>
  );
}
