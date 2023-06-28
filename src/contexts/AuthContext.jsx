import { createContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import apiService from "../app/apiService";
import { decodeToken, isValidToken } from "../utils/jwt";

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
      const { isAuthenticated, user, mode } = action.payload;
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

const setSession = accessToken => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
  }
};

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

  const logout = async callback => {
    setSession(null);
    dispatch({
      type: LOGOUT,
    });
    toast.success("Logged out successfully!");
    callback();
  };

  const register = async (
    { username, password, role, avatarUrl },
    callback
  ) => {
    const response = await apiService.post("/auth/register", {
      username,
      password,
      role,
      avatarUrl,
    });
    toast.success(response.message);
    callback();
  };

  const createUser = async (
    { username, password, role, avatarUrl },
    callback
  ) => {
    const response = await apiService.post("/users/", {
      username,
      password,
      role,
      avatarUrl,
    });
    toast.success(response.message);
    callback();
  };

  const updateUser = async (
    { id, username, role, active, avatarUrl },
    callback
  ) => {
    const response = await apiService.patch(`/users/${id}`, {
      id,
      username,
      role,
      active,
      avatarUrl,
    });
    toast.success(response.message);
    callback();
  };

  const deleteUser = async ({ id }, callback) => {
    const response = await apiService.delete(`/users/${id}`);
    toast.success(response.message);
    callback();
  };

  const updateAccount = async ({ id, username, avatarUrl }, callback) => {
    const response = await apiService.patch(`/account/${id}`, {
      id,
      username,
      avatarUrl,
    });
    toast.success(response.message);
    callback();
  };

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

  const deleteNote = async ({ id }, callback) => {
    const response = await apiService.delete(`/notes/${id}`);
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
        createNote,
        updateNote,
        deleteNote,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
