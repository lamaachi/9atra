import {createSlice } from '@reduxjs/toolkit'

const currentUser ={
        id:0,
        firstname: "",
        lastname: "",
        username: "",
        telephone: "",
        role: "",
}
const userSlice = createSlice({
    name:"user",
    initialState:{
        currentUser:currentUser
    },

    reducers:{
        setUser:(state,action)=>{
            state.currentUser = action.payload
        },
        clearUser:(state)=>{
            state.currentUser = null
        }
    }
})

export const {setUser,clearUser} = userSlice.actions

export default userSlice.reducer