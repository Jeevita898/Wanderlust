# Wanderlust - Airbnb Inspired Full Stack Web Application

🔗 Live Demo: https://wanderlust-1-uk7l.onrender.com

## Overview

Wanderlust is a full stack Airbnb-inspired web application that allows users to explore, create, review, edit, and manage travel stay listings with secure authentication, cloud image uploads, maps integration, and responsive UI.

## Features

- Authentication & Authorization
- Create, Edit & Delete Listings
- Reviews & Ratings
- Cloudinary Image Uploads
- Interactive Maps using Mapbox
- Session & Flash Message Handling
- Password Validation
- Responsive UI

## Tech Stack

**Frontend:** EJS, Bootstrap, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas  
**Authentication:** Passport.js  
**Cloud Services:** Cloudinary, Mapbox  
**Deployment:** Render

## Local Setup

```bash
git clone <repo-url>
cd wanderlust
npm install
```

Create a `.env` file and add:

```env
ATLAS_URL=
SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
MAP_TOKEN=
```

Run the project:

```bash
node app.js
```

Visit:

```txt
http://localhost:8080
```

## Future Improvements

- Booking System
- Wishlist/Favorites
- Admin Dashboard
- Payment Integration
- Nearby Listings Search

## Author

Jeevita Devadig  
GitHub: https://github.com/Jeevita898

