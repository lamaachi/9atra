import {createSlice} from '@reduxjs/toolkit'

const rdvs = []


const rdvSlice = createSlice({
    name:"rdv",
    initialState:{
       rdvs:null
    },
    reducers:{
        setrdvs:(state,action)=>{

        },
       
    }
})


export const {setrdvs} = rdvSlice.actions;
export default rdvSlice;