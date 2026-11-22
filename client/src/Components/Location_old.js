//fd60c2159fef4aaabaaff9dad66043d9

import React, { useState, useEffect } from "react";

const Location = () => {
  const OPENCAGE_API_KEY = "fd60c2159fef4aaabaaff9dad66043d9";

  const [location, setLocation] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({
          latitude,
          longitude,
          accuracy,
        });

        try {
          // Prepare the OpenCage API URL
          const params = new URLSearchParams({
            q: `${latitude},${longitude}`,
            key: OPENCAGE_API_KEY,
            limit: "1",
            no_annotations: "1",
          });

          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?${params}`,
          );

          if (!response.ok) {
            throw new Error("OpenCage API request failed.");
          }

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const components = result.components;

            setPlaceInfo({
              formattedAddress: result.formatted,
              city:
                components.city ||
                components.town ||
                components.village ||
                components.municipality ||
                components.county ||
                "Not available",

              region:
                components.state ||
                components.state_district ||
                "Not available",

              country: components.country || "Not available",

              postcode: components.postcode || "Not available",

              road: components.road || "Not available",

              confidence: result.confidence,
            });
          } else {
            setError("Could not retrieve address details.");
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setError("Failed to retrieve address information.");
        } finally {
          setLoading(false);
        }
      },

      (err) => {
        switch (err.code) {
          case 1:
            setError("Location permission was denied.");
            break;
          case 2:
            setError("Your current location is unavailable.");
            break;
          case 3:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown location error occurred.");
        }

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, []);

  return (
    <div>
      <h4>My Current Location</h4>

      {loading && <p>Getting your current location...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {location && (
        <div>
          <h5>Geographical Coordinates</h5>

          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>

          <p>
            <strong>GPS Accuracy:</strong> {location.accuracy.toFixed(2)} meters
          </p>

          {location.accuracy > 100 && (
            <p style={{ color: "orange" }}>
              Location accuracy is low. Try moving outdoors or enabling your
              device's location services.
            </p>
          )}
        </div>
      )}

      {placeInfo && (
        <div style={{ marginTop: "1rem" }}>
          <h5>Address Information</h5>

          <p>
            <strong>Full Address:</strong> {placeInfo.formattedAddress}
          </p>

          <p>
            <strong>City:</strong> {placeInfo.city}
          </p>

          <p>
            <strong>Region:</strong> {placeInfo.region}
          </p>

          <p>
            <strong>Country:</strong> {placeInfo.country}
          </p>

          <p>
            <strong>Postcode:</strong> {placeInfo.postcode}
          </p>

          <p>
            <strong>Street:</strong> {placeInfo.road}
          </p>

          <p>
            <strong>Geocoding Confidence:</strong> {placeInfo.confidence}
          </p>
        </div>
      )}
    </div>
  );
};

export default Location;
