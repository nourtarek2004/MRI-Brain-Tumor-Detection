
import { createContext, useState } from "react";

export let UserContext = createContext();

export default function UserContextProvider({ children }) {
  let [userData, setUserData] = useState(null);
  let [userRole, setUserRole] = useState(null);
 


  return (
    <UserContext.Provider value={{ userData, setUserData, userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
}