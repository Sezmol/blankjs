import type { ReactNode } from "react";
import { IntroductionPage } from "./pages/introduction";
import { GettingStartedPage } from "./pages/getting-started";
import { SelectPage } from "./pages/select";
import { DialogPage } from "./pages/dialog";

export type NavItem = {
  title: string;
  path: string;
  element: ReactNode;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const nav: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", path: "/", element: <IntroductionPage /> },
      {
        title: "Getting Started",
        path: "/getting-started",
        element: <GettingStartedPage />,
      },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Dialog", path: "/components/dialog", element: <DialogPage /> },
      { title: "Select", path: "/components/select", element: <SelectPage /> },
    ],
  },
];
