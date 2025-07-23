import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import UnAuthRoute from './utils/UnAuthRoute';
import Navbar from './components/Navbar';
import GroupsPage from './pages/groups/GroupsPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';
import CreateGroupPage from './pages/groups/CreateGroupPage';
import PrivateRoute from './utils/PrivateRoute';
import TransactionsPage from './pages/transactions/TransactionsPage';
import AddTransaction from './pages/transactions/AddTransaction';
import PurposesPage from './pages/purposes/PurposesPage';
import AddPurpose from './pages/purposes/AddPurpose';
import EditPurpose from './pages/purposes/EditPurpose';
import EditTransaction from './pages/transactions/EditTransaction';
import SubscriptionsPage from './pages/subscriptions/SubscriptionsPage';
import AddSubscription from './pages/subscriptions/AddSubscription';
import OAuth2RedirectHandler from './pages/auth/OAuthRedirectHandler';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={
              <UnAuthRoute>
                <Login />
              </UnAuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <UnAuthRoute>
                <SignUp />
              </UnAuthRoute>
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions/add"
            element={
              <PrivateRoute>
                <AddTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions/edit/:transactionId"
            element={
              <PrivateRoute>
                <EditTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <PrivateRoute>
                <SubscriptionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions/:transactionId/subscriptions/add"
            element={
              <PrivateRoute>
                <AddSubscription />
              </PrivateRoute>
            }
          />
          <Route
            path="/purposes"
            element={
              <PrivateRoute>
                <PurposesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/purposes/add"
            element={
              <PrivateRoute>
                <AddPurpose />
              </PrivateRoute>
            }
          />
          <Route
            path="/purposes/edit/:purposeId"
            element={
              <PrivateRoute>
                <EditPurpose />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <PrivateRoute>
                <GroupsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-group"
            element={
              <PrivateRoute>
                <CreateGroupPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <PrivateRoute>
                <GroupDetailPage />
              </PrivateRoute>
            }
          />
          <Route path="/oauth2-redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
