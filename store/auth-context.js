import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();

  async function authenticate(token) {
    setAuthToken(token);
    await SecureStore.setItemAsync("token", token);
  }

  function logout() {
    setAuthToken(null);
    SecureStore.deleteItemAsync("token");
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
