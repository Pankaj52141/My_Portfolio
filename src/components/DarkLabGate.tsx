import { useEffect, useState } from 'react';
import NotAllowed from '@/pages/NotAllowed';

const DarkLabGate = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('darklab_verified') === 'true';
    setVerified(isVerified);
  }, []);

  if (!verified) return <NotAllowed />;
  return <>{children}</>;
};

export default DarkLabGate;
