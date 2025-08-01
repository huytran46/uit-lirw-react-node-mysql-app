import { UNSAFE_ErrorResponseImpl, useRouteError } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const S3ErrorImage = () => {
  const [s3ErrorImageUrl, setS3ErrorImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadSignedUrl = async () => {
      try {
        const res = await fetch(`${API_URL}/s3`);
        if (!res.ok) throw new Error("Failed to fetch signed URL");
        const data = await res.json();
        if (!data.url) throw new Error("No URL returned");
        setS3ErrorImageUrl(data.url);
      } catch (err) {
        console.error(err);
        setError("Failed to load signed image URL");
      } finally {
        setLoading(false);
      }
    };

    loadSignedUrl();
  }, []);

  if (loading) {
    return <div className="text-gray-500 p-4">Loading image...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!s3ErrorImageUrl) {
    return <div className="text-gray-400 p-4">No image available</div>;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <img
        src={s3ErrorImageUrl}
        alt="S3 Error"
        className="max-w-md max-h-64 object-contain"
        onError={() => {
          setError("Image failed to load");
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
