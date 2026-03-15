from fastapi import FastAPI, UploadFile, File
from PIL import Image
import numpy as np
import pandas as pd
import tensorflow as tf
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("model.h5", compile=False)
classes = pd.read_csv("labels.csv")

@app.get("/")
def home():
    return {"message": "Traffic sign API running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    image = image.convert("L")
    image = image.resize((90,90))

    image = np.array(image)
    image = np.expand_dims(image, axis=0)

    prediction = model.predict(image)
    prediction_class = np.argmax(prediction, axis=1)[0]

    label = classes["Name"][prediction_class]

    return {"prediction": str(label)}