import jwtDecode from "jwt-decode";

/**
 * @description This file contains the functions to work with JWT
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */

/**
 * @description Check if the token is valid
 * @param {string} accessToken
 * @returns {boolean} True if the token is valid, false otherwise
 */
export const isValidToken = accessToken => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

/**
 * @description Decode the token
 * @param {string} accessToken
 * @returns {object} The decoded token
 */
export const decodeToken = accessToken => {
  if (!accessToken) {
    return null;
  }
  const decoded = jwtDecode(accessToken);
  return decoded;
};
