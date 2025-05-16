import { createContext,useState,useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AuthContext=createContext();

export const AuthProvider=({ children })=>{
    const[user,setUser]=useState(null);

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            const decodedUser=jwtDecode(token);
            setUser(decodedUser);
        }
    },[]);

    const login=async(email,password)=>{
        const {data} = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {email,password});
        localStorage.setItem("token",data.token);
        setUser(jwtDecode(data.token));
    };

    const logout=()=>{
        localStorage.removeItem("token");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthContext;