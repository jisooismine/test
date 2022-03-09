import React from 'react'
import {HashRouter,Navigate,Routes,Route} from 'react-router-dom'
import Login from '../view/login/Login'
import Detail from '../view/news/Detail'
import News from '../view/news/News'
import NewsSandBox from '../view/newssandbox/NewsSandBox'
export default function IndexRouter() {
    return (
        <HashRouter>
           <Routes>
           <Route path="/login" element={<Login/>}/>
           <Route path="/news" element={<News/>}></Route>
           <Route path="/detail/:id" element={<Detail/>}/>
                {/* <Route path="/" component={NewsSandBox}/> */}
                <Route path="/*" element={localStorage.getItem("token")? <NewsSandBox/>:<Navigate to="/login"/>}/>
           </Routes>
        </HashRouter>
    )
}