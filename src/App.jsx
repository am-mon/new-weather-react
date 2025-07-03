import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { BrowserRouter, useLocation } from "react-router-dom";
import Home from "./pages/Home";

const TRACKING_ID = "G-FNNRR964C0";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return (
    <>
      <BrowserRouter>
        <AnalyticsTracker />
        <Home />
      </BrowserRouter>
    </>
  );
}

export default App;
