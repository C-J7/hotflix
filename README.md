# **Hotflix - Movie Watchlist and Recommendation App By C-J7** 🎬  

Welcome to **Hotflix**, a sleek and feature-rich movie application that allows users to discover movies, add them to a personal watchlist, and explore tailored recommendations. Inspired by the simplicity and functionality of streaming platforms, Hotflix aims to deliver a clean and user-friendly experience.


## **Overview**

Hotflix is a Next.js-powered web application designed to provide the following features:  
- Browse and explore trending movies fetched via the **TMDB API**.  
- Add or remove movies to/from a personal **Watchlist**.  
- Watch movie trailers with seamless integration of YouTube.  
- Explore **similar movies** and genres for tailored recommendations.  

The app prioritizes **functionality** and **performance** while maintaining a clean and intuitive interface.


## **Features**

1. **Landing Page**: A sleek cinematic sign-in page.  
2. **Homepage**:  
   - Browse movies fetched dynamically using the TMDB API.  
   - Filter movies by **genre**, **release year**, and other parameters.  
3. **Watchlist**:  
   - Add or remove movies to/from a dedicated watchlist.  
   - Stored locally using **Local Storage** for persistence.  
4. **Recommendations Page**: View recommended or similar movies.  
5. **Streaming Page**:  
   - Watch trailers directly via embedded YouTube videos.  
   - A link to external movie streaming platforms is provided.  


## **Tech Stack** ⚙️

The Hotflix app leverages modern technologies for performance and maintainability:

| **Technology**        | **Description**                                |
|------------------------|-----------------------------------------------|
| **Next.js**           | React framework for server-side rendering.    |
| **TypeScript**        | Static typing for better code quality.        |
| **TMDB API**          | Fetch movie data (details, trailers, posters).|
| **YouTube Embed**     | Seamless trailer streaming integration.       |
| **Local Storage**     | Client-side persistence for the watchlist.    |
| **Vercel**            | Deployment platform for hosting the app.      |
| **CSS Modules**       | Scoped and maintainable component styling.    |
| **Tabler Icons**      | Icon set for enhancing UI design.             |


## **Deployment**

The Hotflix app is live and can be accessed here:  
🔗 [Hotflix on Vercel](https://hotflix-chi.vercel.app/)  


## **Setup Instructions**

Follow these steps to run Hotflix locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/C-J7/hotflix
   cd hotflix
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   Create a `.env.local` file in the root directory and add your TMDB API key:  
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at: `http://localhost:3000`


## **Message**

Hotflix was built to demonstrate the capabilities of **modern web development** frameworks like **Next.js** and how seamlessly APIs and local data can work together. The app emphasizes performance, usability, and functionality, making it a great starting point for anyone exploring **full-stack movie applications**.

Thank you for checking out Hotflix! I hope you find it helpful and inspiring. Contributions are welcome! 😊  


## **Contact**

If you have any questions, suggestions, or feedback, feel free to reach out:  
**Your Name**  
🔗 [GitHub](https://github.com/C-J7)  
