import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { SuccessDialog } from './components/SuccessDialog';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
      <SuccessDialog />
    </AuthProvider>
  );
}
