import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { debounce } from "lodash";

interface UserFormProps {
    onSubmit: (data: any) => void;
    initialData: any;
    isEditMode: boolean;
    userRole?: string;
    formTitle?: string;
}

const UserForm = ({ onSubmit, initialData, isEditMode, userRole, formTitle }: UserFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: userRole === "admin" ? "" : "user",
    });
    const [location, setLocation] = useState({ lat: 27.7172, lng: 85.3240 }); // Default location of Kathmandu
    const [markerPosition, setMarkerPosition] = useState({ lat: 27.7172, lng: 85.3240 });
    const [suggestions, setSuggestions] = useState([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (initialData && initialData.data) {
            setFormData({
                name: initialData.data.name,
                email: initialData.data.email,
                password: "",
                address: initialData.data.address,
                role: initialData.data.role
            });
            setLocation({
                lat: initialData.data.location.latitude,
                lng: initialData.data.location.longitude,
            });
            setMarkerPosition({
                lat: initialData.data.location.latitude,
                lng: initialData.data.location.longitude,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: ""
            });
            setLocation({
                lat: 27.7172,
                lng: 85.3240,
            });
            setMarkerPosition({
                lat: 27.7172,
                lng: 85.3240,
            });
        }
    }, [initialData]);

    // Debounce API calls for address suggestions
    const debouncedFetchSuggestions = useCallback(
        debounce(async (query) => {
            if (!query) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await axios.get("https://maps.gomaps.pro/maps/api/place/autocomplete/json", {
                    params: {
                        key: import.meta.env.VITE_GOMAPS_API_KEY,
                        input: query,
                    },
                });
                setSuggestions(response.data.predictions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        }, 500),
        []
    );

    // Clean up debounce on unmount
    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [debouncedFetchSuggestions]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, address: e.target.value });
        debouncedFetchSuggestions(e.target.value);
    };

    const handlePlaceSelect = async (placeId: string, description: string) => {
        try {
            const response = await axios.get("https://maps.gomaps.pro/maps/api/geocode/json", {
                params: {
                    key: import.meta.env.VITE_GOMAPS_API_KEY,
                    place_id: placeId,
                },
            });

            if (!response.data.results || response.data.results.length === 0) {
                console.error("No location found for the selected place.");
                return;
            }

            const { lat, lng } = response.data.results[0].geometry.location;
            setLocation({ lat, lng });
            setFormData({ ...formData, address: description });
            setMarkerPosition({ lat, lng });
            setSuggestions([]);
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const handleMapClick = async (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setMarkerPosition({ lat, lng });

        try {
            const response = await axios.get("https://maps.gomaps.pro/maps/api/geocode/json", {
                params: {
                    key: import.meta.env.VITE_GOMAPS_API_KEY,
                    latlng: `${lat},${lng}`,
                },
            });

            if (response.data.results && response.data.results.length > 0) {
                const address = response.data.results[0].formatted_address;
                setFormData({ ...formData, address });
            } else {
                console.error("No address found for the selected location.");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (userRole && !formData.role) {
            alert("Please select a role.");
            return;
        }

        const submitData: any = {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            role: formData.role || "user",
            location: {
                latitude: location.lat,
                longitude: location.lng,
            },
        };

        if (!isEditMode || formData.password) {
            submitData.password = formData.password;
        }

        onSubmit(submitData);
    };

    return (
        <div className="form-container">
            <form className="user-form" onSubmit={handleSubmit}>
                <h2>{formTitle || (isEditMode ? "Edit User" : "Create User")}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {!isEditMode && (
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                )}
                {userRole === "admin" && (
                    <select
                        id="roleDropdown"
                        className="form-control"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        {!isEditMode && (
                            <option value="" disabled>
                                Select Role
                            </option>
                        )}
                        <option value="user">User</option>
                        <option value="editor">Editor</option>
                    </select>
                )}
                <input
                    type="text"
                    placeholder="Search Address"
                    value={formData.address}
                    onChange={handleAddressChange}
                />

                {suggestions.length > 0 && (
                    <ul className="address-suggestions">
                        {suggestions.map((suggestion: any) => (
                            <li key={suggestion.place_id} onClick={() => handlePlaceSelect(suggestion.place_id, suggestion.description)}>
                                {suggestion.description}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Map for selecting location */}
                <div className="map-container">
                    <LoadScript
                        googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                        loadingElement={<div>Loading...</div>}
                        onLoad={() => setIsMapLoaded(true)}
                    >
                        {isMapLoaded ? (
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "400px" }}
                                center={location}
                                zoom={10}
                                onClick={handleMapClick}
                            >
                                <Marker
                                    position={markerPosition}
                                    draggable={false}
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                    }}
                                />
                            </GoogleMap>
                        ) : (
                            <div>Loading map...</div>
                        )}
                    </LoadScript>
                </div>

                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default UserForm;