import React from "react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import "./index.css";
import Signup from "./pages/auth/Register.tsx";
import Login from "./pages/auth/Login.tsx";
import Logout from "./pages/auth/Logout.tsx";
import MainPage from "./pages/chat/MainPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

function getRouter() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <MainPage />,
        },
      ],
    },
    {
      path: "*",
      element: <p>404 Error - Nothing here...</p>,
    },
  ]);

  return router;
}

const App = () => {
  return <RouterProvider router={getRouter()} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(
  /*<StrictMode>*/
  <App />,
  /*</StrictMode>*/
);
