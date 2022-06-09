import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Splash from "./components/splash"
import {BrowserRouter, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
        <BrowserRouter>
              <Routes>
                <Route path="/dashboard" element = {
                  <App />
                } />
                <Route path = "/" element = {
                  <Splash />
                } />
              </Routes>
        </BrowserRouter>
);