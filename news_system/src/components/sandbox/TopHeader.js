import React,{useState} from 'react'
import { Layout, Dropdown,Menu ,Avatar} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const {role:{roleName},username} =  JSON.parse(localStorage.getItem("token")) 

 export default function TopHeader() {
    const [collapsed,setCollapsed]=useState(false)
    const changeSide = ()=>{
      setCollapsed(!collapsed)
    }
    let navigate = useNavigate();
    const menu = (
        <Menu>
          <Menu.Item key='a'>
           {roleName}
          </Menu.Item>
          <Menu.Item key='b' danger onClick={()=>{
             localStorage.removeItem('token');
             navigate('/login')
          }}>退出</Menu.Item>
        </Menu>
      );
    
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {collapsed?<MenuUnfoldOutlined onClick={changeSide}/> : <MenuFoldOutlined onClick={changeSide}/>}
            <div style={{ float: "right" }}>
                <span>欢迎{username}回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
      </Header>
    )
}


