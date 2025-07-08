
import WalletConfiguration from './WalletConfiguration';
import SecureSessionConfiguration from './SecureSessionConfiguration';

const ConfigurationTab = () => {
  return (
    <div className="space-y-8">
      <WalletConfiguration />
      <SecureSessionConfiguration />
    </div>
  );
};

export default ConfigurationTab;
