/*import { useContext, useState, useEffect, createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // function to get  all users for side bar
   const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users)
        setUnseenMessages(data.unseenMessages ||[]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // funtion to get messages messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages||{}); 
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // function to Send message to selected user
  const sendMessage = async (messageData) => {
   /* if (!selectedUser) {
      toast.error("No user selected to send message");
      return;
    }

    try {
      const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);

      if (data.success) {
        setMessages((prevMessages) =>[...prevMessages,data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to socket "newMessage"
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.off("newMessage"); // ✅ Prevent duplicates

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages)=>[...prevMessages,newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
        //.catch((err) =>
         // console.error("Mark seen failed:", err.message)
      //;
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
        }))
      }
    })
  }

  const unSubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  // Reset unseen count on selecting user
  useEffect(() => {
    if (selectedUser) {
      setUnseenMessages((prev) => {
        const updated = { ...prev };
        delete updated[selectedUser._id];
        return updated;
      });
    }
  }, [selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (<ChatContext.Provider value={value}>
    {children}
    </ChatContext.Provider>)
};
*/
import { useContext, useState, useEffect, createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // function to get all users for side bar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // funtion to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to Send message to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to socket "newMessage"
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
        
      }
    });
  };

  // subscribe to socket "onlineUsers"
  const subscribeToOnlineUsers = () => {
    if (!socket) return;

    socket.off("onlineUsers");

    socket.on("onlineUsers", (onlineUserIds) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isOnline: onlineUserIds.includes(user._id),
        }))
      );
    });
  };

  const unSubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage");
      socket.off("onlineUsers");
    }
  };

  useEffect(() => {
    subscribeToMessages();
    subscribeToOnlineUsers();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  // Reset unseen count on selecting user
  useEffect(() => {
    if (selectedUser) {
      setUnseenMessages((prev) => {
        const updated = { ...prev };
        delete updated[selectedUser._id];
        return updated;
      });
    }
  }, [selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
