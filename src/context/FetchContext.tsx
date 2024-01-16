import { FetchStatus } from "@tanstack/react-query";
import { createContext } from "react";

type FetchContextType = {
  fetchStatus: FetchStatus | undefined;
  isPendingCreateDrillStation: boolean;
  isPendingCreateSkillStation: boolean;
};

export const FetchContext = createContext<FetchContextType>({
  fetchStatus: undefined,
  isPendingCreateDrillStation: false,
  isPendingCreateSkillStation: false,
});
