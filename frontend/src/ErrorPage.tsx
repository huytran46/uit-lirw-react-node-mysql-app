// components/ErrorPage.tsx

import { useRouteError } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const S3ErrorImage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/s3`);
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error("No signed URL received");
        setUrl(data.url);
      } catch (err) {
        console.error(err);
        setError("Image could not be loaded");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-gray-500 p-4">Loading image...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!url) return <div className="text-gray-400 p-4">No image available</div>;

  return (
    <img
      src={url}
      alt="404 Error - Page Not Found Illustration"
      className="max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain mb-6"
      onError={() => {
        setError("Failed to display image");
        setUrl("");
      }}
    />
  );
};

export default function ErrorPage() {
  const error = useRouteError();
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Sorry! The page you’re looking for cannot be found.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <S3ErrorImage />
      <p className="text-gray-800 text-lg mb-4">{errorMessage}</p>
      <a
        href="/"
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition"
      >
        Back to Home
      </a>
    </div>
  );
}
