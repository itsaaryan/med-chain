import { combineReducers } from "redux";
import { contractReducer } from "./contractReducer";

export const rootReducer = combineReducers({
  contracts: contractReducer,
});
