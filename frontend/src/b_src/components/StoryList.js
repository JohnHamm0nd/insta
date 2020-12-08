import React from 'react';
import {Card} from 'antd';
import './StoryList.scss';

//export default 를 바로 지정하는 방법
//이 방법의 경우는 arrow function 을 사용하지 못하고 function 으로 함수 생성을 해야함
export default function StoryList({style}) {
    return (
        <div style={style}>
          <Card title="Stories" size="small">
            Stories from people you follow will show up here.
          </Card>
        </div>
    )
}
