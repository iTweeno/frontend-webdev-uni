import react from "react";

const SessionContext = react.createContext(null);

export const useSession = () => react.useContext(SessionContext);

export const SessionContextProvider = ({ children }) => {
  const [session, setSession] = react.useState(null);

  const refreshSession = async () => {
    return fetch(`https://localhost:8393/api/user/`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    }).then(async (e) => {
      if (!e.ok) {
        return setSession({ loggedIn: false });
      }

      setSession({ loggedIn: true, data: (await e.json()).data });
    });
  };

  const logout = async () => {
    await fetch(`https://localhost:8393/api/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    setSession({ loggedIn: false });
  };

  react.useEffect(() => {
    refreshSession();
  }, []);

  return <SessionContext.Provider value={{ session, refreshSession, logout }}>{children}</SessionContext.Provider>;
};
