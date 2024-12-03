import { useRouter } from "next/router";
import Head from "next/head";

const Streaming: React.FC = () => {
  const router = useRouter();
  const { video_id } = router.query; // Get the YouTube video ID from the query params

  if (!video_id) {
    return <p>Loading...</p>; // Show loading message if video_id isn't ready yet
  }

  return (
    <>
      <Head>
        <title>Streaming - Hotflix</title>
      </Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#000",
        }}
      >
        <h1 style={{ color: "#FFD700", marginBottom: "1rem" }}>Streaming Movie</h1>

        {/* Embed YouTube Iframe using video_id */}
        <iframe
          width="80%"
          height="80vh"
          src={`https://www.youtube.com/embed/${video_id}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default Streaming;
