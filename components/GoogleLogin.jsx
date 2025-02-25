import loginGoogle from '@api/login-google';
import { LoadingDots } from '@components';
import { useMutation } from '@hooks';
import { toaster } from '@lib';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { decode } from 'jsonwebtoken';
import { useEffect, useState } from 'react';

const GoogleLoginComponent = () => {
  const [isLoading, setLoading] = useState(true);
  const [clientId, setClientId] = useState(null);
  const mutation = useMutation(loginGoogle, { errorCallback: () => setLoading(false) });

  useEffect(() => {
    const loadClientId = async () => {
      const id = process.env.GOOGLE_CLIENT_ID;
      setClientId(id);
      setLoading(false);
    };
    loadClientId();
  }, []);

  const onSuccess = async (response) => {
    setLoading(true);
    const data = decode(response?.credential);

    if (!data?.email && !data?.email_verified) {
      toaster.error('Eroare! Email-ul nu este valid');
      setLoading(false);
    } else {
      mutation.mutateAsync({ email: data?.email });
    }
  };

  const onFailure = (error) => {
    toaster.error('Autentificarea nu a putut fi realizată');
    console.error(error);
    setLoading(false);
  };

  if (isLoading || !clientId) {
    return <LoadingDots />;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
