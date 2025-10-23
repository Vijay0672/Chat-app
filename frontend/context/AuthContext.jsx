/*
import { createContext,useEffect } from "react";
import axios from "axios"
import { useState } from "react";
import toast from "react-hot-toast";
import {io} from "socket.io-client"



const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;


export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{

    const [token,setToken]= useState(localStorage.getItem("token"));
    const [authUser,setAuthUser] = useState(null);
    const [OnlineUsers,setOnlineUser] = useState([]);
    const [socket,setSocket]= useState(null);
  
    const checkAuth = async()=>{
        try {
           const {data} = await axios.get("/api/auth/check");

           if(data.success){
            setAuthUser(data.user)
            connectSocket(data.user)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
// login function  to handle user authentication and socket connection

 const login = async (state,credentials)=>{
    try {
         const {data} = await axios.post(`/api/auth/${state}`,credentials);
         if(data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"]= data.token;
            setToken(data.token);
            localStorage.setItem("token",data.token);
            toast.success(data.message)
         }
         else{
            toast.error(data.message)
         }
    } catch (error) {
        toast.error(error.message)
    }
 }
 // logout function to handle user logout and socket disconnection
 const logout = async()=>{
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"]=null;
    toast.success("Log out successfully");
    socket.disconnect();
 }
  // update profile function to handle user profile
   
  const updateProfile = async(body)=>{
    try {
        const {data} = await axios.put("/api/auth/update-profile",body);
        if(data.success){
            setAuthUser(data.user);
            toast.success("porfile updated Successfully")
        }
    } catch (error) {
         toast.error(error.message)
    }
  }
 //connect socket function to handle socket connection and online users updates
    const connectSocket = (userData)=>{
        if(!userData||socket?.connected) return;
        const newSocket = io(backendUrl,{
            query:{
                userId:userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineusers",(userIds)=>{
            setOnlineUser(userIds);
        })
    }

     useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token;
            
        } 
        checkAuth();
     },[])

    const value ={
         axios,
         authUser,
         OnlineUsers,
         socket,
         login,
         logout,
         updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}*/

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Set backend URL from .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [OnlineUsers, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check authentication on mount
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Login
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Log out successfully");
    if (socket) socket.disconnect();
  };

  // Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Connect to Socket.io and handle online users
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    // Listen for online user list from server
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds.map(String));
     // setOnlineUser(userIds.map(String)); // Ensure all IDs are strings
    });
  };

  // Set token header and check auth on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
    // eslint-disable-next-line
  }, []);

  const value = {
    axios,
    authUser,
    OnlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
