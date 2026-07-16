import { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/axios";

export default function useVehicles(initialParams = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [apiParams, setApiParams] = useState({ page: 1, ...initialParams });

  const [clientFilters, setClientFilters] = useState({
    searchTerm: "",
    transmission: "all",
  });

  const fetchVehicles = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, v]) => v != null && v !== "" && v !== "all",
        ),
      );

      const response = await api.get("/api/vehicle", { params: cleanParams });
      const rawData =
        response.data?.data?.vehicles || response.data?.vehicles || [];

      const mappedData = rawData.map((car) => ({
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

      setVehicles(mappedData);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(apiParams);
  }, [apiParams, fetchVehicles]);

  const updateApiParams = (newParams) => {
    const pageToSet = newParams.page !== undefined ? newParams.page : 1;
    setApiParams((prev) => ({ ...prev, ...newParams, page: pageToSet }));
  };

  const updateClientFilters = (newFilters) => {
    setClientFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
      const term = clientFilters.searchTerm?.trim().toLowerCase();
      const matchesSearch = term
        ? `${car.brand} ${car.model}`.toLowerCase().includes(term) ||
          car.description?.toLowerCase().includes(term) ||
          car.descriptionEn?.toLowerCase().includes(term)
        : true;

      const matchesTransmission =
        clientFilters.transmission === "all" ||
        car.transmission?.toLowerCase() ===
          clientFilters.transmission?.toLowerCase();

      return matchesSearch && matchesTransmission;
    });
  }, [vehicles, clientFilters]);

  return {
    vehicles: filteredVehicles,
    loading,
    error,
    updateApiParams,
    updateClientFilters,
  };
}
