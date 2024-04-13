import {createSlice} from '@reduxjs/toolkit'

const centres = []
const centre = {

}

const centreSlice = createSlice({
    name:"centre",
    initialState:{
        centreList : centres,
        currentCentre: null,
    },
    reducers:{
        setCenters:()=>{

        },
        setCurrentCentre: (state, action) => {
            state.currentCentre = action.payload;
        },
    }
})


export const {setCurrentCentre,setCenters} = centreSlice.actions;
export default centreSlice;