import { configureStore  } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import centreSlice from "./reducers/centreSlice";
import rdvSlice from "./reducers/rdvSlice";


export const store = configureStore({
    reducer:{
        user:userSlice,
        centre:centreSlice,
        rdv:rdvSlice
    }
})