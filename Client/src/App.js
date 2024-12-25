import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import EmailVerificationRequired from './pages/EmailVerificationRequired';
import UnAuthRoute from './utils/UnAuthRoute';
import Navbar from './components/Navbar';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import PrivateRoute from './utils/PrivateRoute'
import TransactionsPage from './pages/TransactionsPage';
import AddTransaction from './pages/AddTransaction';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<UnAuthRoute><Login /></UnAuthRoute>} />
                    <Route path="/signup" element={<UnAuthRoute><SignUp /></UnAuthRoute>} />
                    <Route path="/email-verification-required" element={<EmailVerificationRequired />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
                    <Route path="/transactions/add" element={<AddTransaction />} />
                    <Route path="/groups" element={<PrivateRoute><GroupsPage /></PrivateRoute>} />
                    <Route path="/new-group" element={<PrivateRoute><CreateGroupPage /></PrivateRoute>} />
                    <Route path="/groups/:groupId" element={<PrivateRoute><GroupDetailPage /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
