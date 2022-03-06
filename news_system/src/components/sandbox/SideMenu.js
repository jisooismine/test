import React,{useEffect,useState} from 'react'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'; //withrouter已经被弃用了 这里使用useNavigate  实现多级路由下还能继承路由对象的history location等特性
import './index.css'
import {connect} from 'react-redux'
import axios from 'axios';

  const { Sider } = Layout;
  const { SubMenu } = Menu;

 function SideMenu(props) {
  const navigate = useNavigate();
   const [menuList,setMenuList]=useState([])
   //useeffect这里只在挂载和卸载才使用
   useEffect(()=>{
    axios.get('http://localhost:5000/rights?_embed=children').then(
      res=>{
        setMenuList(res.data)
      }
    )
   },[])
   //这里是对icon进行配置 因为后端请求回来的数据中不带icon 在这里创建一个对象进行管理
   const iconList = {
     '/home':<UserOutlined/>,
     '/user-manage':<UserOutlined/>,
     '/right-manage':<UserOutlined/>,
     '/right-manage/role/list':<UserOutlined/>,
     '/right-manage/right/list':<UserOutlined/>,
     '/user-manage/list':<UserOutlined/>}

  // const menuList=[
  //   {
  //     key:'/home',
  //     title:'首页',
  //     icon: <UserOutlined/>
  //   },
  //   {
  //     key:'/user-manage',
  //     title:'用户管理',
  //     icon: <UserOutlined/>,
  //     children:[{        
  //     key:'/user-manage/list',
  //     title:'用户列表',
  //     icon: <UserOutlined/>}
  //     ]
  //   },
  //   {
  //     key:'/right-manage',
  //     title:'权限管理',
  //     icon: <UserOutlined/>,
  //     children:[{        
  //       key:'/right-manage/role/list',
  //       title:'角色列表',
  //       icon: <UserOutlined/>},
  //       { key:'/right-manage/right/list',
  //         title:'权限列表',
  //         icon: <UserOutlined/>}
  //     ]
  //   }
  // ]
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const pagePermission = (item)=>{
    return item.pagepermisson && rights.includes(item.key)
  }
  const setItem=(menuList)=>{
      return (
        menuList.map((item)=>{       
          if(item.children?.length>0 && pagePermission(item)){
          return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title} >
            {setItem(item.children)}
          </SubMenu>
        }
        // 这里的navigate是实现withrouter中props.history.push(item.key)点击进行路由的跳转
        return pagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>navigate(item.key)}>{item.title}</Menu.Item>
      }
        

        )
      )
  }
    const selectKeys = [useLocation().pathname];
    const openKeys = ['/'+useLocation().pathname.split('/')[1]]
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} className="aaaaaaa" defaultOpenKeys={openKeys}>
              {setItem(menuList)}
          </Menu>
        </div>
      </div>
        </Sider>
    )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>({
  isCollapsed
})
export default connect(mapStateToProps)(SideMenu)