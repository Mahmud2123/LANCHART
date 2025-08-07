import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../components/hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

function RegisterForm({ setIsLoading }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, error: authError, loading } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = t('usernameRequired');
    if (!formData.email.trim()) newErrors.email = t('emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('invalidEmail');
    if (!formData.password) newErrors.password = t('passwordRequired');
    else if (formData.password.length < 6) newErrors.password = t('passwordTooShort');
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('passwordsDoNotMatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      await register(formData);
    } catch (err) {
      console.error('Registration error:', err);
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
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        error={errors.username}
        aria-label={t('username')}
        className="rounded-lg"
      />
      <Input
        label={t('email')}
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        error={errors.email}
        aria-label={t('email')}
        className="rounded-lg"
      />
      <Input
        label={t('password')}
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        error={errors.password}
        aria-label={t('password')}
        className="rounded-lg"
      />
      <Input
        label={t('confirmPassword')}
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
        error={errors.confirmPassword}
        aria-label={t('confirmPassword')}
        className="rounded-lg"
      />
      <Button
        type="submit"
        fullWidth
        loading={loading}
        className="btn-bauchi-primary rounded-lg transition-all duration-300 hover:scale-105"
        aria-label={t('createAccount')}
      >
        {t('createAccount')}
      </Button>
    </form>
  );
}

export default RegisterForm;