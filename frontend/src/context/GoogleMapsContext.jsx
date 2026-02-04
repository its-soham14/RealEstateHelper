import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GoogleMapsContext = createContext({
    isLoaded: false,
    loadError: undefined
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

// Libraries to load. Defined outside component to prevent re-renders
const libraries = ["places"];

export const GoogleMapsProvider = ({ children }) => {
    const [authError, setAuthError] = React.useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBo_lWoM6oRas7lmykFmFdtc2dyQYPfNlc",
        libraries: libraries
    });

    React.useEffect(() => {
        // Global hook for Google Maps auth failure
        window.gm_authFailure = () => {
            setAuthError("Google Maps Authentication Failed. Please check API Key and Billing.");
            console.error("Google Maps Authentication Failed");
        };

        return () => {
            window.gm_authFailure = null;
        }
    }, []);

    const error = loadError ? loadError.message : authError;

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, loadError: error ? new Error(error) : undefined }}>
            {children}
        </GoogleMapsContext.Provider>
    );
};
