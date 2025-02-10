import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(18);
    const [gender, setGender] = useState('male');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            let url = `${process.env.REACT_APP_API_URL}/users/auth/signup`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    password,
                    age,
                    gender: gender === 'male' ? true : false,
                }),
            });
            if (response.status === 400) {
                throw new Error('Email already in use!')
            }
            alert('Check your email to verify it and use the app without limits!');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div id='auth-root'>
            <div className="auth-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Gender</label>
                        <div className="radio-group">
                            <div className="radio-option">
                                <input type="radio" id="male" name="gender" value="male" onChange={(e) => setGender(e.target.value)} />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="radio-option">
                                <input type="radio" id="female" name="gender" value="female" onChange={(e) => setGender(e.target.value)} />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/login"><strong>Log In</strong></Link></p>
            </div>
        </div>
    );
};

export default SignUp;