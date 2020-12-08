import React from 'react';
import AppLayout from 'components/AppLayout';
import PostList from 'components/PostList';
import {useHistory} from 'react-router-dom';
import StoryList from 'components/StoryList';
import SuggestionList from 'components/SuggestionList';
import {Button} from 'antd';


function Home() {
    const history = useHistory();
    const handleClick = () => {
        history.push('/post/new');
    }
    //엘리먼트를 변수안에 넣었다가 사용할 수도 있다
    const sidebar = (
        <>
            <Button
                type='primary'
                block
                style={{ marginBottom: '1rem'}}
                onClick={handleClick}
            >
                새 포스팅 쓰기
            </Button>
            <StoryList style={{marginBottom: '1rem'}} />
            <SuggestionList />
        </>
    );
    
    return (
        <AppLayout sidebar={sidebar}>
            <PostList />
        </AppLayout>
    )
}

export default Home;
