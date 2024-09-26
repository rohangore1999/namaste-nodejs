import { configureStore } from "@reduxjs/toolkit"

// Slice
import userReducer from './userSlice'
import feedReducer from './feedSlice'
import connectionReducer from './connectionSlice'
import requestReducer from './requestSlice'

const appStore = configureStore({
    reducer: {
        user: userReducer, // user store
        feed: feedReducer, // feeds store
        connection: connectionReducer,
        request: requestReducer
    }
})

export default appStore