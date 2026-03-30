import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MarketsPage from "./pages/MarketsPage";
import DeFiPage from "./pages/DeFiPage";
import WalletPage from "./pages/WalletPage";
import NFTPage from "./pages/NFTPage";
import TradingPage from "./pages/TradingPage";
import MEVPage from "./pages/MEVPage";
import AIPage from "./pages/AIPage";
import ServicesPage from "./pages/ServicesPage";
import RealEstatePage from "./pages/RealEstatePage";
import GodModePage from "./pages/GodModePage";
import LotteryPage from "./pages/LotteryPage";
import StudioPage from "./pages/StudioPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import WalletConnectPage from "./pages/WalletConnectPage";
import VideoPage from "./pages/VideoPage";

export const router = createBrowserRouter([
  {
    path: "/connect",
    Component: WalletConnectPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "markets", Component: MarketsPage },
      { path: "defi", Component: DeFiPage },
      { path: "wallet", Component: WalletPage },
      { path: "nft", Component: NFTPage },
      { path: "real-estate", Component: RealEstatePage },
      { path: "trading", Component: TradingPage },
      { path: "mev", Component: MEVPage },
      { path: "ai", Component: AIPage },
      { path: "services", Component: ServicesPage },
      { path: "lottery", Component: LotteryPage },
      { path: "studio", Component: StudioPage },
      { path: "profile", Component: ProfilePage },
      { path: "video", Component: VideoPage },
      { path: "god-mode", Component: GodModePage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);