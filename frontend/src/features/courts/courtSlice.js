import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCourtsRequest, getCourtByIdRequest } from "../../api/courtApi";

const initialState = {
  items: [],
  selectedCourt: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    search: "",
    location: "all",
    availability: "all", // 'all' | 'available' | 'unavailable'
    sortByPrice: "none", // 'none' | 'low-high' | 'high-low'
  },
};

export const fetchCourts = createAsyncThunk(
  "courts/fetchCourts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllCourtsRequest();
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load courts"
      );
    }
  }
);

export const fetchCourtById = createAsyncThunk(
  "courts/fetchCourtById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getCourtByIdRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load court details"
      );
    }
  }
);

const courtSlice = createSlice({
  name: "courts",
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
    },
    setAvailabilityFilter: (state, action) => {
      state.filters.availability = action.payload;
    },
    setSortByPrice: (state, action) => {
      state.filters.sortByPrice = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: "",
        location: "all",
        availability: "all",
        sortByPrice: "none",
      };
    },
    clearSelectedCourt: (state) => {
      state.selectedCourt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Courts
      .addCase(fetchCourts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const rawData = action.payload;
        if (Array.isArray(rawData)) {
          state.items = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          state.items = rawData.data;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchCourts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Court By ID
      .addCase(fetchCourtById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourtById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCourt = action.payload?.data || action.payload;
      })
      .addCase(fetchCourtById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setSearchFilter,
  setLocationFilter,
  setAvailabilityFilter,
  setSortByPrice,
  resetFilters,
  clearSelectedCourt,
} = courtSlice.actions;

// Selectors
export const selectAllCourts = (state) => state.courts?.items || [];
export const selectSelectedCourt = (state) => state.courts?.selectedCourt || null;
export const selectCourtsStatus = (state) => state.courts?.status || "idle";
export const selectCourtsError = (state) => state.courts?.error || null;
export const selectCourtFilters = (state) => state.courts?.filters || initialState.filters;

// Filtered & Sorted selector
export const selectFilteredCourts = (state) => {
  const courts = state.courts?.items || [];
  const { search, location, availability, sortByPrice } = state.courts?.filters || initialState.filters;

  return courts
    .filter((court) => {
      // Search match
      const matchSearch =
        !search ||
        court.name.toLowerCase().includes(search.toLowerCase()) ||
        court.location.toLowerCase().includes(search.toLowerCase());

      // Location match
      const matchLocation =
        location === "all" ||
        court.location.toLowerCase() === location.toLowerCase();

      // Availability match
      const matchAvailability =
        availability === "all" ||
        (availability === "available" && court.isAvailable) ||
        (availability === "unavailable" && !court.isAvailable);

      return matchSearch && matchLocation && matchAvailability;
    })
    .sort((a, b) => {
      if (sortByPrice === "low-high") {
        return a.pricePerHour - b.pricePerHour;
      }
      if (sortByPrice === "high-low") {
        return b.pricePerHour - a.pricePerHour;
      }
      return 0;
    });
};

export default courtSlice.reducer;
