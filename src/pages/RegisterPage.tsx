import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import { authApi, usersApi } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ApiError } from '@/types';
import type { AxiosError } from 'axios';

const schema = z.object({
  username: z.string().min(3, 'Minimum 3 characters').max(50),
  email: z.string().email('Must be a valid email'),
  displayName: z.string().min(2, 'Minimum 2 characters').max(100),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await authApi.register(values);
      const authResp = await authApi.login({ username: values.username, password: values.password });
      localStorage.setItem('accessToken', authResp.accessToken);
      const user = await usersApi.me();
      return { authResp, user };
    },
    onSuccess: ({ authResp, user }) => {
      setAuth(authResp, user);
      navigate('/');
    },
    onError: (err: AxiosError<ApiError>) => {
      const msg = err.response?.data?.message ?? 'Registration failed';
      const fieldErrors = err.response?.data?.fieldErrors ?? {};
      if (fieldErrors.username) setError('username', { message: fieldErrors.username });
      if (fieldErrors.email) setError('email', { message: fieldErrors.email });
      if (fieldErrors.password) setError('password', { message: fieldErrors.password });
      if (!Object.keys(fieldErrors).length) setError('root', { message: msg });
    },
  });

  return (
    <div className="min-h-screen bg-[#13151d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#a855f7]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#ff6b35]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#e84393] flex items-center justify-center mb-4 shadow-2xl shadow-[#ff6b35]/30 animate-pulse-glow">
            <span className="text-3xl font-extrabold text-white leading-none">C</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create your account</h1>
          <p className="text-[#636b82] text-sm mt-1">Join Chatrix today</p>
        </div>

        {/* Card */}
        <div className="bg-[#181d2a] border border-[#252b3a] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-5">
            <Input
              label="Display Name"
              placeholder="Your full name"
              leftIcon={<User size={16} />}
              {...register('displayName')}
              error={errors.displayName?.message}
            />
            <Input
              label="Username"
              placeholder="Choose a username"
              leftIcon={<AtSign size={16} />}
              {...register('username')}
              error={errors.username?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock size={16} />}
              {...register('password')}
              error={errors.password?.message}
            />

            {errors.root && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 animate-fade-in">
                {errors.root.message}
              </div>
            )}

            <Button type="submit" size="lg" loading={mutation.isPending} className="mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#636b82] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ff8c5a] hover:text-[#ff6b35] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
