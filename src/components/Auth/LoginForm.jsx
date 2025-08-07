import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

function LoginForm({ setIsLoading }) {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.trim()) newErrors.username = t('usernameRequired');
    if (!credentials.password) newErrors.password = t('passwordRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(authError || Object.keys(errors).length > 0) && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md text-sm">
          {authError || Object.values(errors)[0]}
        </div>
      )}
      <Input
        label={t('username')}
        type="text"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        required
        error={errors.username}
        aria-label={t('username')}
        className="rounded-lg"
      />
      <Input
        label={t('password')}
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        required
        error={errors.password}
        aria-label={t('password')}
        className="rounded-lg"
      />
      <Button
        type="submit"
        fullWidth
        loading={loading}
        className="btn-bauchi-primary rounded-lg transition-all duration-300 hover:scale-105"
        aria-label={t('signIn')}
      >
        {t('signIn')}
      </Button>
    </form>
  );
}

export default LoginForm;