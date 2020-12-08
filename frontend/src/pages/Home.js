import React, { useState, useEffect } from 'react';
import AppLayout from 'components/AppLayout';
import PostList from 'components/PostList';
import {useHistory} from 'react-router-dom';
import StoryList from 'components/StoryList';
import SuggestionList from 'components/SuggestionList';
import FollowingList from 'components/FollowingList';
import Chat from 'components/Chat';
import { getPost } from "../_actions/post_actions"
import { useDispatch, useSelector } from "react-redux"
import {Button} from 'antd';


function Home() {
    const history = useHistory()
    const [sideComponent, setSideComponent] = useState()
    const [key, setKey] = useState('1')
    
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.userData)
    
    let jwtToken = window.localStorage.getItem('jwtToken')
    const headers = {Authorization: `JWT ${jwtToken}`}
    
    const handleSidebar = (key) => {
        if (key.key === '1') {
            dispatch(getPost('/api/posts/', headers))
            setKey('1')
        } else if (key.key === '2') {
            let params = {username: userData.data.user.username}
            dispatch(getPost('/api/posts/', headers, params))
            setSideComponent(newPost)
            setKey('2')
        } else if (key.key === '3') {
            setSideComponent(following)
            setKey('3')
        } else if (key.key === '4') {
            setKey('4')
        }
        
    }
    
    const handleClick = () => {
        history.push('/post/new');
    }
    
    //엘리먼트를 변수안에 넣었다가 사용할 수도 있다
    const newPost = (
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
    
    
    const following = (
        <>
            <FollowingList />
        </>
    )
    
    const chat = (
        <>
            <Chat />
        </>
    )
    
    useEffect(() => {
        dispatch(getPost('/api/posts/', headers))
        setSideComponent(newPost)
    }, [])
    
    
    
    return (
        <AppLayout sidebar={sideComponent} side={handleSidebar}>
            {key === '4' ? <Chat />
                : <PostList />
            }
        </AppLayout>
    )
}

export default Home;
