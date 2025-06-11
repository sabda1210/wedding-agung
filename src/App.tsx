import { Routes, Route } from "react-router-dom";
import Home from "./components/page/Home";
import PageInserUrl from "./components/page/PageInserUrl";
function App() {
  return (
    <Routes>
      <Route path="/agung-mila" element={<Home />} />
      <Route path="/agung-mila/invite" element={<PageInserUrl />} />
    </Routes>
  );
}

export default App;
