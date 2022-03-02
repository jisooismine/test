import React, { useState, useEffect, useRef } from 'react'
import { Button, Table,Modal, Switch} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user_manage/UserForm'
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setdataSource] = useState([])
    const [isAddVisible,setisAddVisible] = useState(false)
    const [isUpdatevisible,setisUpdatevisible]=useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [current, setcurrent] = useState(null)
    const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        const roleObj = {
            "1":'superadmin',
            '2':'admin',
            '3': 'editor'
        }
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            const list = res.data
            setdataSource(roleObj[roleId]==='superadmin'?list:[
                ...list.filter(item=>item.username===username),
                ...list.filter(item=>item.region ===region && roleObj[item.roleId]==='editor')
            ])
        })
    }, [roleId,region,username])

    useEffect(() => {
        axios.get("http://localhost:5000/regions").then(res => {
            const list = res.data
            setregionList(list)
        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            const list = res.data
            console.log(res.data);
            setroleList(list)
        })
    }, [])


    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                {
                    text:"全球",
                    value:"全球"
                } ,   
                {
                    text:"亚洲",
                    value:"亚洲"
                }   ,
                {
                    text:"大洋洲",
                    value:"大洋洲"
                }   ,
                {
                    text:"欧洲",
                    value:"欧洲"
                }   ,
                {
                    text:"北美洲",
                    value:"北美洲"
                }  ,
                {
                    text:"南美洲",
                    value:"南美洲"
                } ,
                {
                    text:"非洲",
                    value:"非洲"
                }  ,
                {
                    text:"南极洲",
                    value:"南极洲"
                }   

            ],
            onFilter:(value,item)=>{
                if(value==="全球"){
                    return item.region===""
                }
                return item.region===value
            },
            render: (region) => {
                return <b>{region===""?'全球':region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role)=>{
                return role?.roleName //这里的问号是表示如果有role再执行下一步rolename 如果没有就不执行下一步
            }
        },
        {
            title: "用户名",
            dataIndex: 'username'
        },
        {
            title: "用户状态",
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                //这里的checked属性是来辅助按钮按下 disabled表示一些按钮被禁用
                return <Switch checked={roleState}  disabled={item.default} onChange={()=>handleChange(item)}></Switch>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}/>
                    
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>handleUpdate(item)}/>
                </div>
            }
        }
    ];
    const handleUpdate = (item)=>{
        setTimeout(()=>{
            setisUpdatevisible(true)
            if(item.roleId===1){
                //禁用
                setisUpdateDisabled(true)
            }else{
                //取消禁用
                setisUpdateDisabled(false)
            }
            updateForm.current.setFieldsValue(item)//表示重新将当前dom元素的值显示出来
        },0) //用异步来实现 保证modal显示出来之后才将数据填充进去 因为react不能保证都渲染完成。
        setcurrent(item)
    }

    const handleChange = (item)=>{
        // console.log(item)
        item.roleState = !item.roleState
        setdataSource([...dataSource])

        axios.patch(`http://localhost:5000/users/${item.id}`,{
            roleState:item.roleState
        })
    }
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }
    //删除
    const deleteMethod = (item) => {
        // console.log(item)
       setdataSource(dataSource.filter(data=>data.id!==item.id))
       axios.delete(`http://localhost:5000/users/${item.id}`)
       
    }
    const addFormOk = ()=>{
        //validateFields触发表单提交事件
        addForm.current.validateFields().then(value=>{
            setisAddVisible(false)
            axios.post(`http://localhost:5000/users`,{
                ...value,
                "default":false,
                "roleState":true
            }).then(res=>{
                setdataSource([...dataSource,{...res.data,
                    role:roleList.filter(item=>item.id===value.roleId)[0] //这里filter得到的是包含一个元素的数组，所以需要加上【0】将这一个元素取出来
                }])
            })
        })
    }
    const updateFormOk=()=>{
        updateForm.current.validateFields().then(value=>{
            setisUpdatevisible(false);
            setdataSource(dataSource.map(item=>
               {
                   if(item.id ===current.id)
                   {
                       return {
                           ...item,
                           ...value,   //这里展开是将现有修改后的value值覆盖到前面的item里面 
                           role:roleList.filter(data=>data.id===value.roleId)[0]  //这一项是保证名字能够正确显示出来
                       }
                   }
                   return item
               }
               
        ))
        setisUpdateDisabled(!isUpdateDisabled)
        axios.patch(`http://localhost:5000/users/${current.id}`,value)
    })
    }

    return (
        <div>
            <Button type='primary' onClick={()=>{setisAddVisible(true)}}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
                />
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={()=>{
                    setisAddVisible(false)
                }}
                onOk={() => {
                    addFormOk();
                }}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm}/>
            </Modal>
            <Modal
                visible={isUpdatevisible}
                title="更改用户"
                okText="确定"
                cancelText="取消"
                onCancel={()=>{
                    setisUpdatevisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => {
                    updateFormOk();
                }}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
            </Modal>
        </div>
    )
}

