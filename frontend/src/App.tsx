// src/App.tsx → FINAL 100% WORKING VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Layout from './components/Layout';
import AutomationLayout from './pages/Automation/AutomationLayout';

// Pages
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';

// Automation Pages
import Rules from './pages/Automation/Rules';
import Sequence from './pages/Automation/Sequence';
import ReplyMaterial from './pages/Automation/ReplyMaterial';
import ChatbotLayout from './pages/Automation/Chatbot/chatbotLayout'; 


// Broadcast
import Broadcast from './pages/Broadcast/Broadcast';
import NewTemplatePage from './pages/Broadcast/NewTemplate'; 
import BroadcastAnalytics from './pages/Broadcast/BroadcastAnalytics';
import BroadcastSchedule from './pages/Broadcast/BroadcastSchedule';

function App() {
  // Simple auth check - replace with real auth later
  const isLoggedIn = true; // Change to false to test login

  return (
    <Router>
      <Routes>
        {/* LOGIN PAGE - FIRST PAGE */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* IF NOT LOGGED IN → SHOW MAIN APP */}
        <Route element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/inbox" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          
          {/* USER MANAGEMENT */}
          <Route path="/users" element={<UserManagement />} />
          
          {/* ANALYTICS */}
          <Route path="/analytics" element={<Analytics />} />
          
          

          {/* BROADCAST */}
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/broadcast/new" element={<NewTemplatePage />} />
          <Route path="/broadcast/analytics" element={<BroadcastAnalytics />} />
          <Route path="/broadcast/schedule" element={<BroadcastSchedule />} />
          
          {/* AUTOMATION */}
          <Route path="/automation" element={<AutomationLayout />}>
            <Route index element={<Rules />} />
            <Route path="rules" element={<Rules />} />
            <Route path="sequence" element={<Sequence />} />
            <Route path="reply-material" element={<ReplyMaterial />} />
            <Route path="chatbot" element={<ChatbotLayout />} />
          </Route>
        </Route>

        {/* REDIRECT ANYTHING ELSE TO HOME */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;