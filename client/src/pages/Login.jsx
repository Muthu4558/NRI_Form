import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'adminnri@gmail.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      toast.success('Login Successful! 🎉');
      setTimeout(() => navigate('/admin'), 1000); // delay for toast visibility
    } else {
      toast.error('Invalid email or password!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 to-green-100 animate-gradient-x">
      <div className="relative w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl shadow-lg border border-white/30 p-10">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-teal-500 text-white font-semibold shadow-md hover:scale-105 transform transition duration-300"
          >
            🔐 Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
