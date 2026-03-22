"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // NEW

  const uploadImage = async () => {
    if (!file) {
      setError("No file uploaded");
      return;
    }

    setError("");
    setPrediction("");
    setLoading(true); // START loading

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://anshidam-project2.hf.space/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false); // STOP loading
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-white/75 rounded-2xl p-8 w-[70%] md:w-[50%] lg:w-[40%]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Traffic Sign Detection
        </h1>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-6">
          <input
            className="flex-1 border border-gray-900 rounded-lg p-3 w-full"
            type="file"
            accept="image/*"
            disabled={loading} // disable while loading
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
                setError("");
              }
            }}
          />

          <button
            className={`px-5 py-3 rounded-lg w-24 text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 cursor-pointer"
            }`}
            onClick={uploadImage}
            disabled={loading} // disable click
          >
            {loading ? "Loading..." : "Classify"}
          </button>
        </div>

        <div className="h-8 mt-6 text-center">
          {error && <p className="text-gray-700 font-medium">{error}</p>}

          {!error && prediction && (
            <h2 className="text-xl font-semibold text-gray-700">
              {prediction}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
