import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout";
import { nav } from "./routes";

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        ...nav
          .flatMap((section) => section.items)
          .map((item) => ({ path: item.path, element: item.element })),
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
