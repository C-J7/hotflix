import { useRouter } from "next/router";
import Head from "next/head";
import { GoogleLogin } from "@react-oauth/google";
import GoogleAuthProvider from "@/components/GoogleAuthProvider"; // Import the GoogleAuthProvider
import styles from "@/styles/Home.module.css";
import Banner from "@/components/Banner"; 


export default function Home() {
  const router = useRouter();

  // Handle successful Google Sign-In
  const handleGoogleSuccess = (response: any) => {
    console.log("Google Sign-In Success:", response);
    //save the user session here, e.g token or user info
    router.push("/homepage"); // Redirect to homepage after sign-in
  };

  // Handle Explore Movies (without sign-in)
  const handleExploreMovies = () => {
    router.push("/homepage"); // Redirect to homepage
  };

  return (
    <GoogleAuthProvider> 
      <>
        <Head>
          <title className={styles.Maintext}>Welcome to Hotflix</title>
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
              <button
                className={styles.ExploreButton}
                onClick={handleExploreMovies}
              >
                Explore Movies
              </button>
              
               {/* Google Sign-In Button */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Google Sign-In Error")}
                useOneTap // Optional:  one-tap sign-in functionality
              />
            </div>
          </main>
        </div>
      </>
    </GoogleAuthProvider>
  );
}


