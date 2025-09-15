import { useContext } from "react";
import { UserContext } from "./UserContext";


//provides access to context, which enables access to user state and related functions easily. 
export const useUser = () => {
    return useContext(UserContext)
}