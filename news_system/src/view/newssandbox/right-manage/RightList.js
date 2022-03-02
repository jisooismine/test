import React from 'react'
import { Button, Table, Tag ,Modal, Switch,Popover} from 'antd'
import { useState,useEffect} from 'react'
import axios from 'axios';
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
const {confirm} = Modal;
export default function RightList() {
    const [dataSource,setDataSource]=useState([]);
    //useEffect 第二个参数是空数组表示相当于在函数componentdidmount 数组里面放state里面的哪个部分就是监测哪个部分，不写第二个参数就是全部都监测，
    //如果想模拟componentwillunmount,就需要在第一个参数里面返回一个函数
    useEffect(()=>{
        axios.get('http://localhost:5000/rights?_embed=children').then(res=>{
            const list = res.data;
            list.forEach(element => {
                if(element.children.length ===0)
                {element.children = '';}
            });
            setDataSource(list)
        })
    },[])
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render:(id)=>{
           return <b>{id}</b>
          }
        },
        {
          title: '权限名称',
          dataIndex: 'title',
        },
        {
          title: '权限路径',
          dataIndex: 'key',
          render:(key)=>{
              return <Tag color='skyblue'>{key}</Tag>
          }
        },
        {
            title: '操作',
            render:(item)=>{
                return <div>
                    <Button onClick={()=>confirmMethod(item)} danger icon={<DeleteOutlined /> } shape="circle"></Button>
                    <Popover  content={<div style={{textAlign:"center"}}>
                        <Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}}></Switch>
                    </div>} title="页面配置项" trigger={item.pagepermisson===undefined?"":"click"}>  
                   {/* 这里的disabled是判断如果没有pagepermission属性的话 就不具备修改的功能 */}
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/> 
                    </Popover>
                </div>
            }
          },
      ]

      const  switchMethod = (item)=>{
        item.pagepermisson = item.pagepermisson===1?0:1;
        // console.log(item)
        setDataSource([...dataSource])

        if(item.grade===1){
            axios.patch(`http://localhost:5000/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }else{
            axios.patch(`http://localhost:5000/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }
      const confirmMethod=(item)=>{
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
              console.log('Cancel');
            },
          });
      }
      const deleteMethod = (item)=>{
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`http://localhost:5000/rights/${item.id}`)}
        else{
            let list = dataSource.filter(data=>data.id ===item.rightId)
            list[0].children = list[0].children.filter(data=>data.id!==item.id)
            //filter深拷贝只是对于一维数组
            setDataSource([...dataSource])
            axios.delete(`http://localhost:5000/children/${item.id}`)
        }

        }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}   
            // pagination是对一页显示的行数进行限制 pagesize确定页面最大显示行数          
            pagination={{
                pageSize:5
            }} />;
        </div>
    )
}
