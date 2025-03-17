import { UserContext } from "./UserContext.ts";
import { ReactNode } from "react";
import { useGetAuthUser } from "../_autogen/api.ts";

export function UserContextProvider({ children }: { children: ReactNode }) {
  const user = useGetAuthUser();

  function handleLogin() {
    globalThis.open("/auth/github/login", "_self");
  }

  function handleLogout() {
    globalThis.open("/auth/logout", "_self");
  }

  return (
    <UserContext.Provider
      value={{
        login: handleLogin,
        logout: handleLogout,
        user: user.data?.data || null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
