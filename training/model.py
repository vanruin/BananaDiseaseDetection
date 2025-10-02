import os
import numpy as np
import tensorflow as tf
import joblib
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report, accuracy_score
from tensorflow.keras.preprocessing.image import ImageDataGenerator

dataset_dir = r"C:\Users\n0body\Desktop\model\archive\Banana Disease Recognition Dataset\Augmented images\Augmented images"


model_path = "knn_banana_disease.pkl"


datagen = ImageDataGenerator(rescale=1.0/255.0, validation_split=0.2)


train_gen = datagen.flow_from_directory(
    dataset_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='sparse',
    subset='training',
    shuffle=False
)

val_gen = datagen.flow_from_directory(
    dataset_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='sparse',
    subset='validation',
    shuffle=False
)

base_model = tf.keras.applications.MobileNetV2(weights="imagenet", include_top=False, pooling="avg") #hehehehee

print("🔎 Extracting features...")
train_features = base_model.predict(train_gen, verbose=1)
val_features   = base_model.predict(val_gen, verbose=1)

train_labels = train_gen.classes
val_labels   = val_gen.classes

print(f"Train features shape: {train_features.shape}")
print(f"Validation features shape: {val_features.shape}")

# 🔹 Train or load KNN
if os.path.exists(model_path):
    print("📥 Loading saved KNN model...")
    knn = joblib.load(model_path)
else:
    print("🤖 Training KNN classifier...")
    knn = KNeighborsClassifier(n_neighbors=3, weights="distance")
    knn.fit(train_features, train_labels)

    joblib.dump(knn, model_path)
    print(f"💾 Model saved at {model_path}")


val_preds = knn.predict(val_features)

print("\n✅ Classification Report:")
print(classification_report(val_labels, val_preds, target_names=list(train_gen.class_indices.keys())))

acc = accuracy_score(val_labels, val_preds)
print(f"🎯 Validation Accuracy: {acc:.4f}")
