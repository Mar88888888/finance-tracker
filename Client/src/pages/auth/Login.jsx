import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/AxiosInstance';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { setAuthToken } = useContext(AuthContext);

  const handleGoogleAuth = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/users/auth/google`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/users/auth/signin`;
      const response = await API.post(
        url,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        setUser(response.data.user);
        setAuthToken(response.data.token);
        navigate('/');
      } else {
        setError('Password or email is incorrect');
      }
    } catch (error) {
      console.log(error.message);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button type="button" className="google-btn" onClick={handleGoogleAuth}>
        Continue with Google
      </button>

      <p>
        Don't have an account?{' '}
        <Link to="/signup">
          <strong>Sign Up</strong>
        </Link>
      </p>
    </div>
  );
};

export default Login;
