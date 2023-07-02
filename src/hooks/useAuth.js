import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * @description This hook is used to get the auth context from AuthContextProvider
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
