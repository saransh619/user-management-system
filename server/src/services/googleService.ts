import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOMAPS_API_KEY = process.env.GOMAPS_API_KEY;

export const getLatLngFromAddress = async (address: string) => {
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&key=${GOOGLE_API_KEY}`;
  const url = `https://maps.gomaps.pro/maps/api/geocode/json?key=${GOMAPS_API_KEY}&address=${encodeURIComponent(
    address
  )}`;
  const response = await axios.get(url);
  const { lat, lng } = response.data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
};
