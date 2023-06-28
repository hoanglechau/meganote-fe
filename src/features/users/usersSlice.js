import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  error: null,
  currentPageUsers: [],
  usersById: {},
  totalPages: 1,
  selectedUser: null,
  users: [],
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getAllUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const users = action.payload;
      state.users = users;
    },

    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { users, count, totalPages } = action.payload;

      users.forEach(user => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map(user => user._id);
      state.totalUsers = count;
      state.totalPages = totalPages;
    },

    getUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.selectedUser = action.payload;
    },

    updateUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    deleteUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    deleteUserNotSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export default slice.reducer;

export const getAllUsers = () => async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get("/users/all");
    dispatch(slice.actions.getAllUsersSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getUsers =
  ({ filterName, filterInactive, page = 1, limit = 12 }) =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    if (filterName) {
      try {
        const params = { page, limit };
        if (
          filterName.toUpperCase() === "EMPLOYEE" ||
          filterName.toUpperCase() === "MANAGER" ||
          filterName.toUpperCase() === "ADMIN"
        ) {
          params.role = filterName;
        } else {
          params.username = filterName;
        }

        if (filterInactive) {
          params.active = filterInactive;
        }
        const response = await apiService.get("/users", { params });
        dispatch(slice.actions.getUsersSuccess(response));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
        const params = { page, limit };
        if (filterInactive) {
          params.active = filterInactive;
        }
        const response = await apiService.get("/users", { params });
        dispatch(slice.actions.getUsersSuccess(response));
      }
    } else {
      try {
        const params = { page, limit };

        if (filterInactive) {
          params.active = filterInactive;
        }
        const response = await apiService.get("/users", { params });
        dispatch(slice.actions.getUsersSuccess(response));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
      }
    }
  };

export const getUser = id => async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/users/${id}`);
    dispatch(slice.actions.getUserSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
