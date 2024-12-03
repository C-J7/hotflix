import React from "react";
import { useRouter } from "next/router";
import { GoogleLogin } from "@react-oauth/google";

const Landing: React.FC = () => {
  const router = useRouter();

  // Handle successful Google Sign-In
  const handleGoogleSuccess = (response: any) => {
    console.log("Google Sign-In Success:", response);
    // Save user session (token) here
    router.push("/"); // Redirect to homepage after sign-in
  };

  // Handle Explore Movies (without sign-in)
  const handleExploreMovies = () => {
    router.push("/"); // Redirect to homepage
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url('https://via.placeholder.com/1920x1080?text=Hotflix+Landing')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Welcome to HOTFLIX</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Your ultimate movie watchlist and recommendation system!
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Sign-In Error")}
        />
        <button
          onClick={handleExploreMovies}
          style={{
            padding: "0.8rem 1.5rem",
            backgroundColor: "#e50914",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Explore Movies
        </button>
      </div>
    </div>
  );
};

export default Landing;
