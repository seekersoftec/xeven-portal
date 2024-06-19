import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { userReducer } from "./userRelated/userSlice";
import { studentReducer } from "./studentRelated/studentSlice";
import { noticeReducer } from "./noticeRelated/noticeSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { complainReducer } from "./complainRelated/complainSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
