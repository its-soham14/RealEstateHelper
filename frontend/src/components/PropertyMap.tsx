import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../context/GoogleMapsContext';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px'
};

// Default center (New Delhi)
const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090
};

interface PropertyMapProps {
    location: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ location }) => {
    const [center, setCenter] = useState(defaultCenter);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useGoogleMaps();

    useEffect(() => {
        if (!location || !isLoaded) return;

        const geocodeAddress = () => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: location }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const newCenter = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    setCenter(newCenter);
                    if (map) {
                        map.panTo(newCenter);
                    }
                } else {
                    console.warn('Geocode was not successful: ' + status);
                }
            });
        };

        geocodeAddress();
    }, [location, isLoaded, map]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    if (loadError) {
        const encodedLocation = encodeURIComponent(location);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

        return (
            <div className="h-100 d-flex flex-column justify-content-center align-items-center bg-light rounded border p-3">
                <p className="text-muted mb-3 text-center small">
                    Map preview unavailable (API Key/Billing Issue).
                </p>
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
                    Open in Google Maps
                </a>
            </div>
        );
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Marker position={center} />
        </GoogleMap>
    ) : <div>Loading Map...</div>;
};

export default PropertyMap;
