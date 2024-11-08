import './App.css';

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
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
