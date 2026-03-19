import { RouterProvider } from "react-router";
import { router } from "./routes";
import { blockAllWebSocketErrors } from "./utils/blockWebSocketErrors";
import { Web3Provider } from "./contexts/Web3Context";

// Bloquer les erreurs WebSocket avant le render
blockAllWebSocketErrors();

export default function App() {
  return (
    <Web3Provider>
      <RouterProvider router={router} />
    </Web3Provider>
  );
}