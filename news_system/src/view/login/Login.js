import React from 'react'
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    let navigate = useNavigate();
    const onFinish = (values) => {
       // console.log(values)
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
        //    console.log(res.data)
            if(res.data.length===0){
                message.error("用户名或密码不匹配")
            }else{
                localStorage.setItem("token",JSON.stringify(res.data[0]))
                // window.location.href = `/`;
                navigate('/')
               
            }
        })
    }
    return (
        <div style={{ background: 'rgb(35, 39, 65)', height: "100%" }}>
        <div className='formContainer'>
            <div className="logintitle">全球新闻发布管理系统</div>
            <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" >
                            登录
                     </Button>
                    </Form.Item>
                </Form>
        </div>
        </div>
    )
}
