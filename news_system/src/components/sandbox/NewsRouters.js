import React, { useState, useEffect } from "react";
import Home from '../../view/newssandbox/home/Home'
import RoleList from '../../view/newssandbox/right-manage/RoleList'
import UserList from '../../view/newssandbox/user-manage/UserList'
import RightList from '../../view/newssandbox/right-manage/RightList'
import { Route , Routes , Navigate} from 'react-router-dom'
import NoperMission from '../../view/newssandbox/nopermission/NoperMission'
import Audit from '../../view/newssandbox/audit-manage/Audit'
import AuditList from '../../view/newssandbox/audit-manage/AuditList'
import Unpublished from '../../view/newssandbox/publish-manage/Unpublished'
import Published from '../../view/newssandbox/publish-manage/Published'
import Sunset from '../../view/newssandbox/publish-manage/Sunset'
import NewsAdd from '../../view/newssandbox/news-manage/NewsAdd'
import NewsCategory from '../../view/newssandbox/news-manage/NewsCategory'
import NewsDraft from '../../view/newssandbox/news-manage/NewsDraft'
import axios from 'axios'
import NewsPreview from "../../view/newssandbox/news-manage/NewsPreview";
import NewsUpdate from "../../view/newssandbox/news-manage/NewsUpdate";

const LocalRouterMap = {
  "/home": <Home/>,
  "/user-manage/list": <UserList/>,
  "/right-manage/role/list": <RoleList/> ,
  "/right-manage/right/list": <RightList/>,
  "/news-manage/preview/:id":<NewsPreview/>,
  "/news-manage/update/:id":<NewsUpdate/>,
  "/news-manage/add": <NewsAdd/>,
  "/news-manage/draft": <NewsDraft/>,
  "/news-manage/category": <NewsCategory/>,
  "/audit-manage/audit": <Audit/>,
  "/audit-manage/list": <AuditList/>,
  "/publish-manage/unpublished": <Unpublished/>,
  "/publish-manage/published": <Published/>,
  "/publish-manage/sunset": <Sunset/>,
};

export default function NewsRouter() {
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const checkRoute=(item)=>{
     return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const checkUserPermission = (item)=>{
     return rights.includes(item.key)
  }
  
  const [backRouteList, setbackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/rights"),
      axios.get("http://localhost:5000/children"),
    ]).then((res) => {
      setbackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);
  return (
    <Routes>
      {backRouteList.map((item) => 
      {
        if(checkRoute(item) && checkUserPermission(item)){
          return(
        <Route
          path={item.key}
          key={item.key}
          element={LocalRouterMap[item.key]}
        />
      )}
         return null
         })}
            <Route path="/" element={<Navigate replace from="/" to="/home" />} />
      {backRouteList.length>0 && <Route path="*" element={<NoperMission />} />}
</Routes>
  )
}
