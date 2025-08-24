import { createBrowserRouter } from "react-router";

import { ChatView } from "./views/chat";
import App from "./App";
import { SignInView } from "./views/sign-in";
import { SignUpView } from "./views/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "chat",
        element: <ChatView />,
      },
      {
        path: "sign-in",
        element: <SignInView />,
      },
      {
        path: "sign-up",
        element: <SignUpView />,
      },
    ],
  },
]);
