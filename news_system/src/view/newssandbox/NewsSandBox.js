import React ,{useEffect}from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Layout } from 'antd'
import NewsRouters from '../../components/sandbox/NewsRouters'
import './NewsSandBox.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const { Content } = Layout;


export default function NewsSandBox() {
    NProgress.start()
    useEffect(()=>{
        NProgress.done()
    })
    return (
        <Layout>
            <SideMenu/>
            <Layout className="site-layout">
                <TopHeader/> 
                <Content
                    className="site-layout-background"
                    style={{
                      margin: '24px 16px',
                      padding: 24,
                      minHeight: 280,
                
                    }}>
                 <NewsRouters></NewsRouters>
                </Content>
            </Layout>
        </Layout>
    )
}
