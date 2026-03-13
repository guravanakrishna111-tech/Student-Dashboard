import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { signIn, signUp, resetPassword, onAuthChange, signInWithGoogle } from '../firebase/firebaseService';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      if (u) {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        navigate('/');
      }
    } catch (err) {
      console.error('Authentication error', err);
      setError(err.message || 'Failed to authenticate');
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }
    try {
      await resetPassword(email);
      setMessage('Password reset email sent');
    } catch (err) {
      console.error('Password reset error', err);
      setError(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="LoginContainer">
      <div className="LoginBox">
        <h2>{mode === 'login' ? 'Sign In' : 'Register'}</h2>
        {error && <div className="LoginError">{error}</div>}
        {message && <div className="LoginMessage">{message}</div>}
        <form onSubmit={handleSubmit} className="LoginForm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="LoginButton">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <button onClick={async () => {
              try {
                await signInWithGoogle();
                navigate('/');
              } catch (err) {
                console.error('Google sign-in error', err);
                setError(err.message || 'Google sign-in failed');
              }
            }}
            className="LoginButton"
            style={{ backgroundColor: '#db4437', marginTop: '10px' }}
          >
            Continue with Google
          </button>
        </div>
        <div className="LoginFooter">
          {mode === 'login' ? (
            <>
              <span onClick={() => setMode('register')} className="LoginLink">
                Don't have an account? Register
              </span>
              <span onClick={handleReset} className="LoginLink">
                Forgot password?
              </span>
            </>
          ) : (
            <span onClick={() => setMode('login')} className="LoginLink">
              Already have an account? Sign in
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;