"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
