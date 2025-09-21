import { useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
//const navigate = useNavigate();

/*UserProvider component will provide context wrapping in all components in this application. */
export default function UserProvider({ children }) {
  const userFromStorage = sessionStorage.getItem('user');
  const [user, setUser] = useState(
    userFromStorage ? JSON.parse(userFromStorage) : { email: '', token: '' }
  );

  const LogOut = () => {
    //empty login data
    setUser({ email: '', token: '' });
    sessionStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, LogOut }}>
      {children}
    </UserContext.Provider>
  );
}
