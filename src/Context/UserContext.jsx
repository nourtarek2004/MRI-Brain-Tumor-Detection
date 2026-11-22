import { createContext, useState } from "react";

export let UserContext = createContext();

export default function UserContextProvider({ children }) {

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  return (
    <UserContext.Provider value={{ userRole, setUserRole, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
}