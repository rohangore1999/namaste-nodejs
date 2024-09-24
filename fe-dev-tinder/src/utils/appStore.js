import { configureStore } from "@reduxjs/toolkit"
import userReducer from './userSlice'

const appStore = configureStore({
    reducer: {
        user: userReducer // user store
    }
})

export default appStore