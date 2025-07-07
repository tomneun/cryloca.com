
import WalletConfiguration from './WalletConfiguration';
import SessionConfiguration from './SessionConfiguration';

const ConfigurationTab = () => {
  return (
    <div className="space-y-8">
      <WalletConfiguration />
      <SessionConfiguration />
    </div>
  );
};

export default ConfigurationTab;
