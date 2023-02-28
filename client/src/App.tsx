import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Paint from "./views/Paint";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/:id" element={<Paint />} />
          <Route
            path="/"
            element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
