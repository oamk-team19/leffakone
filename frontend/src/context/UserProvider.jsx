import { useState } from 'react';
import { UserContext } from './UserContext';

/*UserProvider component will provide context wrapping in all components in this application. */
export default function UserProvider({ children }) {
  const userFromStorage = sessionStorage.getItem('user');
  const [user, setUser] = useState(
    userFromStorage
      ? JSON.parse(userFromStorage)
      : { email: '', id: '', token: '' }
  );

  const LogOut = () => {
    //empty data
    setUser({ email: '', id: '', token: '' });
    sessionStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, LogOut }}>
      {children}
    </UserContext.Provider>
  );
}
