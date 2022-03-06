import React from 'react'
import { Layout, Dropdown,Menu ,Avatar} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {connect} from 'react-redux'

const { Header } = Layout;
const {role:{roleName},username} =  JSON.parse(localStorage.getItem("token")) 

function TopHeader(props) {
    const changeCollapsed = () => {
      //改变state的isCollapsed
      // console.log(props)
      props.changeCollapsed()
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
            {props.isCollapsed ?<MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>}
            <div style={{ float: "right" }}>
                <span>欢迎{username}回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
      </Header>
    )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  // console.log(state)
  return {
      isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
      return {
          type: "change_collapsed"
          // payload:
      }//action 
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)

