import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { ShoppingBag, LogOut } from 'lucide-react';
const VendorHeader = () => {
  const {
    destroySession
  } = useSession();
  const navigate = useNavigate();
  const handleLogout = () => {
    if (confirm('Möchten Sie Ihren Shop wirklich löschen? Alle Daten gehen verloren.')) {
      destroySession();
      navigate('/');
    }
  };
  return;
};
export default VendorHeader;