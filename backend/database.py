from pymongo import MongoClient

MONGO_URI = "mongodb+srv://sonal:1212@cluster0.uqjo9l1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"  # Change this to your MongoDB Atlas URI if needed

client = MongoClient(MONGO_URI)  
db = client["property-app"]  # ✅ Correct way to access a database

print("Connected to MongoDb ",db)