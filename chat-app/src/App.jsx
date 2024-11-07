import { Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import Home from "./components/Home";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} exact />
          <Route path="/chats" element={<Chat/>} exact />
        </Routes>
      </div>
    </>
  );
}

export default App;
