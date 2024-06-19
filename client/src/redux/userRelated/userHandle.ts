import axios from "axios";
import { AppDispatch } from "../store";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
} from "./userSlice";

interface LoginFields {
  email?: string;
  password?: string;
  rollNum?: string;
  studentName?: string;
}

interface RegisterFields {
  email?: string;
  password?: string;
  schoolName?: string;
}

export const loginUser =
  (fields: LoginFields, role: string) => async (dispatch: AppDispatch) => {
    dispatch(authRequest());

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${role.toLowerCase()}/login`,
        fields,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result.data.role) {
        dispatch(authSuccess(result.data));
      } else {
        dispatch(authFailed(result.data.message));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(authError(error.response?.data?.message || error.message));
      } else {
        dispatch(authError("An unexpected error occurred."));
      }
    }
  };

export const registerUser =
  (fields: RegisterFields, role: string) => async (dispatch: AppDispatch) => {
    dispatch(authRequest());

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${role.toLowerCase()}/register`,
        fields,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result.data.schoolName) {
        dispatch(authSuccess(result.data));
      } else if (result.data.school) {
        dispatch(stuffAdded(result.data));
      } else {
        dispatch(authFailed(result.data.message));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(authError(error.response?.data?.message || error.message));
      } else {
        dispatch(authError("An unexpected error occurred."));
      }
    }
  };

export const logoutUser = () => (dispatch: AppDispatch) => {
  dispatch(authLogout());
};

export const getUserDetails =
  (id: string, address: string) => async (dispatch: AppDispatch) => {
    dispatch(getRequest());

    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
      );
      if (result.data) {
        dispatch(doneSuccess(result.data));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(getError(error.response?.data?.message || error.message));
      } else {
        dispatch(getError("An unexpected error occurred."));
      }
    }
  };

export const deleteUser =
  (id: string, address: string) => async (dispatch: AppDispatch) => {
    dispatch(getRequest());
    dispatch(getFailed("Sorry the delete function has been disabled for now."));
  };

export const updateUser =
  (fields: Partial<RegisterFields>, id: string, address: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(getRequest());

    try {
      const result = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/${address}/${id}`,
        fields,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result.data.schoolName) {
        dispatch(authSuccess(result.data));
      } else {
        dispatch(doneSuccess(result.data));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(getError(error.response?.data?.message || error.message));
      } else {
        dispatch(getError("An unexpected error occurred."));
      }
    }
  };

export const addStuff =
  (fields: RegisterFields, address: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(authRequest());

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${address}/create`,
        fields,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.data.message) {
        dispatch(authFailed(result.data.message));
      } else {
        dispatch(stuffAdded(result.data));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(authError(error.response?.data?.message || error.message));
      } else {
        dispatch(authError("An unexpected error occurred."));
      }
    }
  };
