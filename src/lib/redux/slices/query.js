import { createSlice } from "@reduxjs/toolkit";

export const querySlice = createSlice({
	name: "query",
	initialState: {
		page: 1,
		limit: 12,
		sort: "CurrentPriceAsc",
	},
	reducers: {
		setQuery: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
	},
});

export const { setQuery } = querySlice.actions;

export default querySlice.reducer;
