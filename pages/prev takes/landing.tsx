import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Landing: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the desired landing page
    router.push("/new-landing-page"); // Replace with the actual path of your new landing page
  }, [router]);

  return null; // Render nothing as this component is only for redirection
};

export default Landing;
