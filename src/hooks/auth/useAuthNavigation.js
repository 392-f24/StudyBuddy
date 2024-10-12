import { useAuthState } from '@auth/useAuthState';
import { handleSignIn } from '@utils/auth';
import { useNavigate } from 'react-router-dom';

export const useAuthNavigation = () => {
  const [user] = useAuthState();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.uid}`);
    }
  };

  const signInAndCheckFirstTimeUser = () => {
    handleSignIn().then((user) => {
      if (!user) {
        navigate('/edit-profile');
      }
    });
  };

  return { user, handleProfileClick, signInAndCheckFirstTimeUser };
};
