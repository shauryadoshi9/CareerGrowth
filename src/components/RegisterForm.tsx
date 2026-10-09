import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { t } from '../services/i18n';

export const RegisterForm: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      // after successful registration, go to home/dashboard
      navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">{t('register', 'en')}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">{t('name', 'en')}</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">{t('email', 'en')}</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">{t('password', 'en')}</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
          {t('sign_up', 'en')}
        </button>
      </form>
    </div>
  );
};
