"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [error, setError] = useState<string>(""); // added

  const uploadImage = async () => {
    if (!file) {
      setError("No file uploaded"); // show error
      return;
    }

    setError(""); // clear error if file exists

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://anshidam-project2.hf.space/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPrediction(data.prediction);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-white/75 rounded-2xl h-[50%] w-[40%] p-8 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Traffic Sign Detection
        </h1>

        <div className="flex flex-row gap-4 items-center justify-center mt-6">
          <input
            className="flex-1 border border-gray-900 rounded-lg p-3 w-12"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
                setError(""); // remove error when user selects file
              }
            }}
          />

          <button
            className="bg-gray-600 text-white px-5 py-3 rounded-lg hover:bg-gray-700 transition w-20 cursor-pointer"
            onClick={uploadImage}
            style={{ width: "6rem" }}
          >
            Classify
          </button>
        </div>

        {/* Prediction / Error */}
        <div className="h-8 mt-8 text-center">
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
