import { createContext } from "react";

export const SessionContext = createContext<{ session_id: string }>({
  session_id: "",
});
