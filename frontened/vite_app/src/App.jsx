import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import BuyPage from "./pages/Buy/BuyPage";
import PostProperty from "./pages/Sell/Owner/PostProperty";
import OwnerDashboard from "./pages/Sell/Owner/OwnerDashboard";
import AgentDashboard from "./pages/Sell/AgentBuilder/AgentDashboard";
import DeveloperLounge from "./pages/Sell/AgentBuilder/DeveloperLounge";
import SalesEnquiry from "./pages/Sell/AgentBuilder/SalesEnquiry";
import FindAgent from "./pages/Sell/SellingTools/FindAgent";
import RatesTrends from "./pages/Sell/SellingTools/RatesTrends";
import PropWorth from "./pages/Sell/SellingTools/PropWorth";
import PropertyValuation from "./pages/Sell/SellingTools/PropertyValuation";
import "./App.css";
import RentPage from "./pages/Rent/RentPages";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          {/* for buy */}
          <Route path="/buy/ready-to-move" element={<BuyPage />} />
          <Route path="/buy/owner-properties" element={<BuyPage />} />
          <Route path="/buy/ready-to-move" element={<BuyPage />} />
          <Route path="/buy/owner-properties" element={<BuyPage />} />
          <Route path="/buy/premium-homes" element={<BuyPage />} />
          <Route path="/buy/new-projects" element={<BuyPage />} />
          <Route path="/buy/budget-homes" element={<BuyPage />} />
          {/* For Owner */}
          <Route path="/sell/post-property" element={<PostProperty />} />
          <Route path="/sell/owner-dashboard" element={<OwnerDashboard />} />

          {/* For Agent & Builder */}
          <Route path="/sell/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/sell/developer-lounge" element={<DeveloperLounge />} />
          <Route path="/sell/sales-enquiry" element={<SalesEnquiry />} />

          {/* Selling Tools */}
          <Route
            path="/sell/property-valuation"
            element={<PropertyValuation />}
          />
          <Route path="/sell/find-agent" element={<FindAgent />} />
          <Route path="/sell/rates-trends" element={<RatesTrends />} />
          <Route path="/sell/propworth" element={<PropWorth />} />
          {/* for rent */}
          <Route path="/rent/:type" element={<RentPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


