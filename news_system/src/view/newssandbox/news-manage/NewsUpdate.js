import React, { useEffect, useState,useRef } from 'react'
import { useNavigate,useParams} from 'react-router-dom';
import { PageHeader ,Steps,Button,Form, Input, Select,message,notification} from 'antd'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const {Option} = Select;

export default function NewsUpdate() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [content,setContent] = useState('');
    const [formInfo,setformInfo] = useState({})
    const User=JSON.parse(localStorage.getItem('token'))
    const params = useParams();
    const handleNext = () => {
        if(current===0){
            NewsForm.current.validateFields().then(res=>{
                setformInfo(res);
                setCurrent(current + 1)
            }).catch(error=>{
                console.log(error)
            })
        }else{
            if(content ==="" || content.trim()==="<p></p>"){
                message.error("新闻内容不能为空")
            }else{
                setCurrent(current + 1)
            }
        }
    }
    const handlePrevious = ()=>{
        setCurrent(current-1)
    }
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
  }
  const NewsForm = useRef(null)

  useEffect(()=>{
      axios.get("http://localhost:5000/categories").then(res=>{
          // console.log(res.data)
          setCategoryList(res.data)
      })
  },[])
  useEffect(() => {
    // console.log()
    axios.get(`http://localhost:5000/news/${params.id}?_expand=category&_expand=role`).then(res => {
        // setnewsInfo(res.data)

        // content , 
        // formInfo 
        let {title,categoryId,content} = res.data
        NewsForm.current.setFieldsValue({
            title,
            categoryId
        })

        setContent(content)
    })
}, [params.id])
  
  const handleSave = (auditState)=>{
      axios.patch(`http://localhost:5000/news/${params.id}`,{
          ...formInfo,
          "content":content,
          "region": User.region?User.region:"全球",
          "auditState": auditState,
      }).then(res=>{
        navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')
        notification.info({
            message: `通知`,
            description:
              `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
            placement:"bottomRight",
        });
      })
  }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={()=>navigate(-1)}
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            
           
            <div style={{marginTop:"50px"}}>
                <div style={{ display: current === 0 ? "" : "none" }}>

                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true,  message: 'Please input your username!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item=>
                                    <Option value={item.id} key={item.id}>{item.title}</Option>    
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>

                <div style={{ display: current === 1 ? "" : "none" }}>
                    <NewsEditor getContent = {(value)=>{
                             setContent(value);
                    }} content = {content}></NewsEditor>
                </div>
                <div style={{ display: current === 2 ? "" : "none" }}>3333</div>

            </div>

            <div style={{marginTop:"50px"}}>
                {
                    current===2 && <span>
                        <Button type="primary" onClick={()=>handleSave(0)}>保存草稿箱</Button>
                        <Button danger  onClick={()=>handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current<2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current>0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}