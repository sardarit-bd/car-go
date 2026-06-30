import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

// Accept initialParams to set the initial API state
export default function useVehicles(initialParams = {}) {
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize apiParams with the passed initialParams
  const [apiParams, setApiParams] = useState(initialParams);
  
  // Parameters that only trigger client-side filtering (no API call)
  const [clientFilters, setClientFilters] = useState({
    searchTerm: "",
    transmission: "all",
  });

  // Fetch data from backend
  const fetchVehicles = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      // Clean undefined/null/empty values so they aren't sent to the API
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== "")
      );
      
      const response = await api.get("/api/vehicle", { params: cleanParams });
      
      // Handle different possible response structures from your backend
      const rawData = response.data?.data?.vehicles || response.data?.vehicles || [];
      
      // MAP BACKEND DATA TO FRONTEND EXPECTED STRUCTURE
      const mappedData = rawData.map(car => ({
        id: car.id,
        image: car.images?.[0]?.imageUrl || car.image || null,
        brand: car.brand || "",
        model: car.model || "",
        class: car.class || "",
        fuel: car.fuel || "Petrol",
        price: car.pricePerDay || car.price || 0,
        description: car.description || "",
        descriptionEn: car.descriptionEn || car.description || "",
        seats: car.seats || 0,
        luggage: car.luggage || 0,
        transmission: car.transmission || "Automatic",
      }));
      
      setAllVehicles(mappedData);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(err);
      setAllVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch from API when apiParams change
  useEffect(() => {
    fetchVehicles(apiParams);
  }, [apiParams, fetchVehicles]);

  // Effect to apply client-side filters when allVehicles or clientFilters change
  useEffect(() => {
    let result = [...allVehicles];

    if (clientFilters.searchTerm) {
      const term = clientFilters.searchTerm.toLowerCase();
      result = result.filter(car => 
        car.brand?.toLowerCase().includes(term) ||
        car.model?.toLowerCase().includes(term) ||
        car.class?.toLowerCase().includes(term)
      );
    }

    if (clientFilters.transmission && clientFilters.transmission !== "all") {
      result = result.filter(car => 
        car.transmission?.toLowerCase() === clientFilters.transmission.toLowerCase()
      );
    }

    setFilteredVehicles(result);
  }, [allVehicles, clientFilters]);

  const updateApiParams = (newParams) => {
    setApiParams(prev => ({ ...prev, ...newParams }));
  };

  const updateClientFilters = (newFilters) => {
    setClientFilters(prev => ({ ...prev, ...newFilters }));
  };

  return { 
    vehicles: filteredVehicles, 
    loading, 
    error, 
    updateApiParams, 
    updateClientFilters 
  };
}