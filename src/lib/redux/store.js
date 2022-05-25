import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import priceSlice from "./slices/price";
import gameSlice from "./slices/game";
import querySlice from "./slices/query";
import filterSlice from "./slices/filter";

const reducers = combineReducers({
	price: priceSlice,
	games: gameSlice,
	query: querySlice,
	filter: filterSlice,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["price", "games"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== "production",
	middleware: [thunk],
});

export default store;
