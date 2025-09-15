import { useState } from 'react'
import { UserContext } from './UserContext'
import axios from 'axios'

//userProvider which contains state variable for user information and sign in/up functions. Async/await syntax is used to call backend with Axios
export default function UserProvider({children}) {
    const userFromStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email:'', password:''})


    const signIn = async (email, password) => {
        const headers = {headers: {'Content-Type': 'application/json'}}
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({user: user}),headers)
        setUser(response.data)
        //After successful login user data is stored into session storage containing token which is used to authorize user when calling backend.
        sessionStorage.setItem('user', JSON.stringify(response.data))
    }

    return (
        <UserContext.Provider value={{user,setUser,signUp,signIn}}>
            {children}
        </UserContext.Provider>
    )
}

/*UserProvider component will provide context wrapping in all components in this
application. Value for the context is user
state and functions setUser, signUp and signIn which can be used/called from all
components within this application.
*/