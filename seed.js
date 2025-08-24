
require("dotenv").config();

//console.log("MapTiler key:", process.env.MAPTILER_KEY);

const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("./models/listing");

const mapTilerKey = process.env.MAPTILER_KEY;

async function backfillGeometry() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); // 👈 change db name if different

  const listings = await Listing.find({ "geometry.type": { $exists: false } });

  for (let listing of listings) {
    try {
      const response = await axios.get(
        "https://api.maptiler.com/geocoding/" +
          encodeURIComponent(listing.location) +
          ".json",
        { params: { key: mapTilerKey } }
      );

      if (response.data.features.length > 0) {
        const coords = response.data.features[0].geometry.coordinates;

        listing.geometry = {
          type: "Point",
          coordinates: coords, // [lng, lat]
        };

        await listing.save();
        console.log(` Updated ${listing.title} with coords: ${coords}`);
      } else {
        console.log(` No coords found for ${listing.title}`);
      }
    } catch (err) {
      console.error(`Error for ${listing.title}:`, err.message);
    }
  }

  mongoose.connection.close();
}

backfillGeometry();
