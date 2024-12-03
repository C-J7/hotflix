import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "793651504601-g1q634kl4li4ao8qovqd6hshrankc2fp.apps.googleusercontent.com";

const GoogleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GoogleOAuthProvider clientId={clientId}>
    {children}
  </GoogleOAuthProvider>
);

export default GoogleAuthProvider;