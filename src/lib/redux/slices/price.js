import { createSlice } from "@reduxjs/toolkit";

export const priceSlice = createSlice({
	name: "price",
	initialState: {
		kwtPrice: 0,
	},
	reducers: {
		setKwtPrice: (state, action) => {
			return {
				...state,
				kwtPrice: action.payload,
			};
		},
	},
});

export const { setKwtPrice } = priceSlice.actions;

export const selectPrice = state => {
	return state.price;
};

export default priceSlice.reducer;
