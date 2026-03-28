import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/loginPage";
import ChatPage from "./pages/chatPage";

function App() {
  return (
    <div className="min-h-screen bg-catDark text-white font-sans selection:bg-catOrange/30">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
