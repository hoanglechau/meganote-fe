import { createContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import apiService from "../app/apiService";
import { decodeToken, isValidToken } from "../utils/jwt";

/**
 * @description This file contains the Authentication context with its states, functions, and the Context Provider
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const LOGOUT = "AUTH.LOGOUT";

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case INITIALIZE:
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext({ ...initialState });

/**
 * @description Set the access token to the local storage and the apiService
 * @param {string} accessToken
 */
const setSession = accessToken => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
  }
};

/**
 * @description The Context Provider for the Authentication context
 * @param {*} children
 */
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persistent Login
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const decoded = decodeToken(accessToken);

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user: decoded.UserInfo,
            },
          });
        } else {
          setSession(null);

          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null },
          });
        }
      } catch (error) {
        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    };
    initialize();
  }, []);

  /**
   * @description Login
   * @param {string} username
   * @param {string} password
   * @param {function} callback
   */
  const login = async ({ username, password }, callback) => {
    const response = await apiService.post("/auth", { username, password });
    const { user, accessToken } = response;
    setSession(accessToken);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, token: accessToken },
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Logout
   * @param {function} callback
   */
  const logout = async callback => {
    setSession(null);
    dispatch({
      type: LOGOUT,
    });
    toast.success("See you again!");
    callback();
  };

  /**
   * @description Register a new user for demo purposes
   * @param {string} username
   * @param {string} fullname
   * @param {string} email
   * @param {string} password
   * @param {string} role
   * @param {function} callback
   */
  const register = async (
    { username, fullname, email, password, role },
    callback
  ) => {
    const response = await apiService.post("/auth/register", {
      username,
      fullname,
      email,
      password,
      role,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Create a new user
   * @param {string} username
   * @param {string} fullname
   * @param {string} email
   * @param {string} password
   * @param {string} role
   * @param {function} callback
   */
  const createUser = async (
    { username, fullname, email, password, role },
    callback
  ) => {
    const response = await apiService.post("/users/", {
      username,
      fullname,
      email,
      password,
      role,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Update a user
   * @param {ObjectId} id
   * @param {string} username
   * @param {string} fullname
   * @param {string} email
   * @param {string} role
   * @param {boolean} active
   * @param {function} callback
   */
  const updateUser = async (
    { id, username, fullname, email, role, active },
    callback
  ) => {
    const response = await apiService.patch(`/users/${id}`, {
      id,
      username,
      fullname,
      email,
      role,
      active,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Delete a user
   * @param {ObjectId} id
   * @param {function} callback
   */
  const deleteUser = async ({ id }, callback) => {
    const response = await apiService.delete(`/users/${id}`);
    toast.success(response.message);
    callback();
  };

  /**
   * @description Update user account settings
   * @param {ObjectId} id
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @param {function} callback
   */
  const updateAccount = async ({ id, username, email, password }, callback) => {
    const response = await apiService.patch(`/account/${id}`, {
      id,
      username,
      email,
      password,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Update user profile
   * @param {ObjectId} id
   * @param {string} fullname
   * @param {string} avatarUrl
   * @param {function} callback
   */
  const updateProfile = async ({ id, fullname, avatarUrl }, callback) => {
    const response = await apiService.put(`/account/${id}`, {
      id,
      fullname,
      avatarUrl,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Create a new note
   * @param {ObjectId} user
   * @param {string} title
   * @param {string} text
   * @param {string} status
   * @param {function} callback
   */
  const createNote = async ({ user, title, text, status }, callback) => {
    const response = await apiService.post("/notes/", {
      user,
      title,
      text,
      status,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Update a note
   * @param {ObjectId} id
   * @param {ObjectId} user
   * @param {string} title
   * @param {string} text
   * @param {string} status
   * @param {function} callback
   */
  const updateNote = async ({ id, user, title, text, status }, callback) => {
    const response = await apiService.patch(`/notes/${id}`, {
      id,
      user,
      title,
      text,
      status,
    });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Delete a note
   * @param {ObjectId} id
   * @param {function} callback
   */
  const deleteNote = async ({ id }, callback) => {
    const response = await apiService.delete(`/notes/${id}`);
    toast.success(response.message);
    callback();
  };

  /**
   * @description Send a POST request to the API to send a password reset email to the user
   * @param {string} email
   * @param {function} callback
   */
  const forgotPassword = async ({ email }, callback) => {
    const response = await apiService.post("/auth/forgotpassword", { email });
    toast.success(response.message);
    callback();
  };

  /**
   * @description Send a PATCH request to the API to update the user's password
   * @param {string} password
   * @param {string} passwordResetToken
   * @param {function} callback
   */
  const resetPassword = async ({ password, passwordResetToken }, callback) => {
    const response = await apiService.patch(
      `/auth/resetpassword/${passwordResetToken}`,
      {
        password,
      }
    );
    toast.success(response.message);
    callback();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        createUser,
        updateUser,
        deleteUser,
        updateAccount,
        updateProfile,
        createNote,
        updateNote,
        deleteNote,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
