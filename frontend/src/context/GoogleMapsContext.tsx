import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

interface GoogleMapsContextType {
    isLoaded: boolean;
    loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
    isLoaded: false,
    loadError: undefined
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
    children: ReactNode;
}

// Libraries to load. Defined outside component to prevent re-renders
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
    const [authError, setAuthError] = React.useState<string | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBo_lWoM6oRas7lmykFmFdtc2dyQYPfNlc",
        libraries: libraries
    });

    React.useEffect(() => {
        // Global hook for Google Maps auth failure
        // @ts-ignore
        window.gm_authFailure = () => {
            setAuthError("Google Maps Authentication Failed. Please check API Key and Billing.");
            console.error("Google Maps Authentication Failed");
        };

        return () => {
            // @ts-ignore
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
