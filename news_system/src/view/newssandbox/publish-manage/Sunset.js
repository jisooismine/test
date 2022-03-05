import {Button} from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPubish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
    // 3=== 已下线的
    const {dataSource,handleDelete} = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>
                删除
            </Button>}></NewsPublish>
        </div>
    )
}