import React from "react";
import App from "../App";
import {Routes,Route} from "react-router";
import ChatPage from "../components/ChatPage";
const AppRoutes =()=>{
    return(
        <Routes>
            <Route path="/" element={<App/>}  />
             <Route path="/chat" element={<ChatPage/>}  />
        </Routes>
    );
};
export default AppRoutes;