import {Button} from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPubish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published() {
    // 2=== 已发布的
    const {dataSource,handleSunset} = usePublish(2)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleSunset(id)}>
                下线
            </Button>}>

            </NewsPublish>
        </div>
    )
}