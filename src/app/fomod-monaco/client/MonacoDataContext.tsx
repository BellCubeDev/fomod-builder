'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { getDarkModernTheme } from "../server/DarkModernTheme";

export interface MonacoDataContextProps {
    theme: Awaited<ReturnType<typeof getDarkModernTheme>>;
    moduleSchema: string;
    infoSchema: string;   
}

export const monacoDataContext = createContext<Partial<MonacoDataContextProps>>({});

export function MonacoDataContextProvider({children, ...data}: {children: React.ReactNode} & MonacoDataContextProps) {
    return <monacoDataContext.Provider value={data}>{children}</monacoDataContext.Provider>;
}

export function useMonacoData() {
    return useContext(monacoDataContext);
}
