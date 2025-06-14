
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Emergency from "./pages/Emergency";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Directory from "./pages/Directory";
import LostFound from "./pages/LostFound";
import Updates from "./pages/Updates";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import SafetyTimerPage from "./pages/SafetyTimer";
import AuthCallback from "./pages/AuthCallback";
import VerificationPending from "./pages/VerificationPending";
import NotFound from "./pages/NotFound";

// Optimized query client with better cache management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
            <Route path="/emergency" element={
              <ErrorBoundary>
                <Emergency />
              </ErrorBoundary>
            } />
            <Route path="/reports" element={
              <ErrorBoundary>
                <Reports />
              </ErrorBoundary>
            } />
            <Route path="/alerts" element={
              <ErrorBoundary>
                <Alerts />
              </ErrorBoundary>
            } />
            <Route path="/directory" element={
              <ErrorBoundary>
                <Directory />
              </ErrorBoundary>
            } />
            <Route path="/lost-found" element={
              <ErrorBoundary>
                <LostFound />
              </ErrorBoundary>
            } />
            <Route path="/updates" element={
              <ErrorBoundary>
                <Updates />
              </ErrorBoundary>
            } />
            <Route path="/resources" element={
              <ErrorBoundary>
                <Resources />
              </ErrorBoundary>
            } />
            <Route path="/profile" element={
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            } />
            <Route path="/safety-timer" element={
              <ErrorBoundary>
                <SafetyTimerPage />
              </ErrorBoundary>
            } />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
