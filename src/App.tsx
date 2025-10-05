import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyShop from "./pages/MyShop";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Chat from "./pages/Chat";
import Rules from "./pages/Rules";
import AdminDashboard from "./pages/AdminDashboard";
import VendorLicense from "./pages/VendorLicense";
import LicenseThanks from "./pages/LicenseThanks";
import Login from "./pages/Login";
import ChooseRole from "./pages/ChooseRole";
import VendorLogin from "./pages/VendorLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/vendor-license" element={<VendorLicense />} />
          <Route path="/license-thanks" element={<LicenseThanks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/my-shop" element={<MyShop />} />
          <Route path="/shop/:pseudonym" element={<Shop />} />
          <Route path="/shop/:pseudonym/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/chat/:withPseudonym" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
