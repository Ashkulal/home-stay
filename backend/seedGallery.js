const mongoose = require("mongoose");
const path = require("path");

if (process.env.VERCEL !== "1") {
    require("dotenv").config({ path: path.join(__dirname, ".env") });
}

const Gallery = require("./models/Gallery");

const images = [
    { title: "Family Room", image_url: "/images/room-family.jpg", category: "Rooms", order: 1 },
    { title: "Double Bedroom", image_url: "/images/room-double.jpg", category: "Rooms", order: 2 },
    { title: "Areca Palm Grove", image_url: "/images/nature-palms.jpg", category: "Nature", order: 3 },
    { title: "Western Ghats Greenery", image_url: "/images/nature-greenery.jpg", category: "Nature", order: 4 },
];

async function seed() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("MONGODB_URI not found in environment variables");
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        await Gallery.deleteMany({});
        console.log("Cleared existing gallery images");

        await Gallery.insertMany(images);
        console.log(`Seeded ${images.length} gallery images`);

        await mongoose.disconnect();
        console.log("Done");
        process.exit(0);
    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    }
}

seed();
