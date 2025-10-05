import { useNavigate } from 'react-router-dom';
import BuySellChoice from '@/components/BuySellChoice';

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleChoice = (choice: 'buyer' | 'seller') => {
    if (choice === 'buyer') {
      navigate('/');
    } else {
      navigate('/vendor-login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
      <BuySellChoice onChoice={handleChoice} />
    </div>
  );
};

export default ChooseRole;
