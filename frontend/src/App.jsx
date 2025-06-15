import { useState, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './pages/auth/sign-in';
import Signup from './pages/auth/sign-up';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Accountpage from './pages/account-page';
import Transaction from './pages/transaction';
import useStore from './store';
import { setAuthToken } from './libs/apiCall';
import { Toaster } from 'sonner';
import Navbar from './components/ui/navbar';

const RootLayout = () => {
  const { user, theme } = useStore((state) => state);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  setAuthToken(user?.token || '');

  return !user ? (
    <Navigate to="/sign-in" replace={true} />
  ) : (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const { theme } = useStore((state) => state);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/" element={<Navigate to="/sign-up" />} />
        <Route element={<RootLayout />}>
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Accountpage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
