import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ThreeBackground } from './ThreeBackground';
import { Toaster } from './ui/toaster';

export function Layout() {
  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}