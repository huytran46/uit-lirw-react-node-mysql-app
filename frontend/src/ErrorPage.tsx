import { UNSAFE_ErrorResponseImpl, useRouteError } from "react-router-dom";
import { useEffect, useState } from "react";

const S3ErrorImage = () => {
  const [s3ErrorImageUrl, setS3ErrorImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadS3Image = async () => {
      try {
        setLoading(true);

        // Method 1: Direct Public URL (simplest approach)
        // If your S3 bucket is public, just use direct URL
        const publicS3Url = import.meta.env.VITE_S3_PUBLIC_URL;
        if (publicS3Url) {
          const imageUrl = `${publicS3Url}/group7-error.gif`; // Replace with your image key
          setS3ErrorImageUrl(imageUrl);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error loading S3 image:", err);
        setError(err instanceof Error ? err.message : "Failed to load image");
        // Fallback to a default image or empty state
        setS3ErrorImageUrl("");
      } finally {
        setLoading(false);
      }
    };

    loadS3Image();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Loading image...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500 text-sm">
          Failed to load S3 image: {error}
        </div>
      </div>
    );
  }

  if (!s3ErrorImageUrl) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400 text-sm">No error image available</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <img
        src={s3ErrorImageUrl}
        alt="S3 Error"
        className="max-w-md max-h-64 object-contain"
        onError={() => {
          setError("Failed to load image");
          setS3ErrorImageUrl("");
        }}
      />
    </div>
  );
};

export default function ErrorPage() {
  const error: unknown = useRouteError();

  const errorMessage =
    error instanceof Error
      ? error.message
      : error instanceof UNSAFE_ErrorResponseImpl
      ? error.statusText ?? "Unknown error"
      : "Unknown error";

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
      <S3ErrorImage />
    </div>
  );
}
