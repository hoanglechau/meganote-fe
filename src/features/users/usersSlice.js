import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

/**
 * @description This file is used to create a redux slice for users feature, including actions and reducers
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */

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

    updateUserSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },

    deleteUserSuccess(state) {
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

/**
 * @description Get all users
 */
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

/**
 * @description Get users with filters and table pagination
 * @param {string} filterName - Filter by full name or role
 * @param {boolean} filterInactive - Filter by active status
 * @param {number} page - Current page
 * @param {number} limit - Number of users per page
 */
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
          params.fullname = filterName;
        }

        if (filterInactive) {
          params.active = filterInactive;
        }
        console.log("params", params);
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

/**
 * @description Get a single user by id
 * @param {ObjectId} id - User id
 */
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
