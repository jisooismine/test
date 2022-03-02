import React,{useState,useEffect} from 'react'
import {Table,Button,Modal,Tree} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const {confirm} = Modal

export default function RoleList() {
    const [dataSource,setDataSource]=useState([]);
    const [rightList,setRightList] = useState([]);
    const [isModalVisible,setisModalVisible] = useState(false)
    const [currentRights, setcurrentRights] = useState([])
    const [currentId, setcurrentId] = useState(0)
    useEffect(()=>{
        axios.get('http://localhost:5000/roles').then(res=>
        setDataSource(res.data))
    },[]) 
    useEffect(()=>{
        axios.get('http://localhost:5000/rights?_embed=children').then(res=>
        setRightList(res.data))
    },[]) 
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                        setisModalVisible(true);
                        setcurrentRights(item.rights)
                        setcurrentId(item.id)
                    }}/>
                </div>
            }
        }
    ]

    const confirmMethod = (item)=>{
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
    
    
    const deleteMethod = (item)=>{
        setDataSource(dataSource.filter(data=>data.id !== item.id))
        axios.delete(`http://localhost:5000/roles/${item.id}`)
    }
    
    const handleOk = ()=>{
        setisModalVisible(false)
        setDataSource(dataSource.map(item=>{
          if(item.id===currentId){
            return {
                ...item,
                rights:currentRights
            }
            
          }
          return item;
        }))
        axios.patch(`http://localhost:5000/roles/${currentId}`,{
            rights:currentRights
        })

    }
    const handleCancel = ()=>{
         setisModalVisible(false)
    }
    const onCheck = (checkKeys)=>{
        // console.log(checkKeys)
        setcurrentRights(checkKeys.checked)
    }

    return (
        <div>
        {/* 这里的rowkey是对column中的item进行表示 因为显示需要key */}
        <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}/>;
        <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                checkedKeys = {currentRights}
                onCheck={onCheck}
                checkStrictly = {true}
                treeData={rightList}
            />

            </Modal>
    </div>
    )
}
