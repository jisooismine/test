import React,{useState,useEffect} from 'react'
import {Table,Button,Modal,notification} from 'antd'
import { useNavigate } from "react-router";
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons'
const {confirm} = Modal


export default function NewsDraft() {
    const [dataSource,setDataSource]=useState([]);
    const {username} = JSON.parse(localStorage.getItem('token'));
    useEffect(()=>{
        axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expand=category`).then(res=>
        setDataSource(res.data))
    },[username]) 
    const navigate = useNavigate();
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item)=>{
              return  <a href={`/#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
          title: '作者',
          dataIndex: 'author'
      },
      {
        title: '分类',
        dataIndex: 'category',
        render:(category)=>{
          return category.title
        }
    },
    {
      title: "操作",
      render: (item) => {
          return <div>
              <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
              
              <Button shape="circle" icon={<EditOutlined />}  onClick={()=>{
                  navigate(`/news-manage/newspreview/${item.id}`)
              }}/>

              <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>
                  handlecheck(item.id)
              } />
          </div>
      }
  }
];

    const handlecheck = (id)=>{
        axios.patch(`http://localhost:5000/news/${id}`,{
            auditState:1
        }).then(res=>{
            navigate('/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                  `您可以到${'审核列表'}中查看您的新闻`,
                placement:"bottomRight"
            });
        })
    }

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
        axios.delete(`http://localhost:5000/news/${item.id}`)
    }
  
    return (
        <div>
        {/* 这里的rowkey是对column中的item进行表示 因为显示需要key */}
        <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} 
                        pagination={{
                          pageSize: 5
                      }} />;
    </div>
    )
}
