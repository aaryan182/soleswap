"use client";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
export default function UpdateListing() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [files, setFiles] = useState([]);
  const pathname = usePathname();
  const listingId = pathname.split("/").pop();
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
  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch("/api/listing/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data[0]);
    };
    fetchListing();
  }, []);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
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
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user.publicMetadata.userMogoId,
          listingId,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      router.push(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  if (!isLoaded) {
    return (
      <h1 className="text-center text-xl my-7 font-semibold">Loading...</h1>
    );
  }
  if (!isSignedIn) {
    return (
      <h1 className="text-center text-xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    );
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update your Listings
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
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
