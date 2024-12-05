import { useRouter } from "next/router";
import Head from "next/head";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import GoogleAuthProvider from "@/components/GoogleAuthProvider"; // Import the GoogleAuthProvider
import styles from "@/styles/Home.module.css";
import Banner from "@/components/Banner";

export default function Home() {
  const router = useRouter();

  // Handle successful Google Sign-In
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        // Send the token to the backend to verify and receive the JWT
        const res = await fetch("/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        if (!res.ok) throw new Error("Failed to login with Google");

        const data = await res.json();
        console.log("JWT Token Received:", data.token);

        // Save JWT to localStorage or cookie (depending on preference)
        localStorage.setItem("authToken", data.token);

        // Redirect to homepage after successful sign-in
        router.push("/homepage");
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    } else {
      console.error("No Google Credential Found");
    }
  };

  // Handle Explore Movies (without sign-in)
  const handleExploreMovies = () => {
    router.push("/homepage"); // Redirect to homepage
  };

  return (
    <GoogleAuthProvider>
      <>
        <Head>
          <title>Welcome to Hotflix</title>
          <meta name="description" content="The ultimate movie watchlist and recommendation system" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Banner />
        <div className={styles.page}>
          <main className={styles.main}>
            <div className={styles.contentWrapper}>
              <h1 className={styles.Maintext}>Welcome to HOTFLIX</h1>
              <p className={styles.subtitle}>The ultimate movie watchlist and recommendation system!</p>

              {/* Explore Movies Button */}
              <button className={styles.ExploreButton} onClick={handleExploreMovies}>
                Explore Movies
              </button>

              {/* Google Sign-In Button */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error("Google Sign-In Error")}
                useOneTap // Optional: one-tap sign-in functionality
              />
            </div>
          </main>
        </div>
      </>
    </GoogleAuthProvider>
  );
}