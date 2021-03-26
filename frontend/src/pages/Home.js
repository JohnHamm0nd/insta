import React, { useState, useEffect } from 'react';
import AppLayout from 'components/AppLayout';
import PostList from 'components/PostList';
import { useHistory } from 'react-router-dom';
import StoryList from 'components/StoryList';
import SuggestionList from 'components/SuggestionList';
import FollowingList from 'components/FollowingList';
import Chat from 'components/Chat';
import ChatSidepanel from 'components/ChatSidepanel'
import { useDispatch, useSelector } from "react-redux"
import { navKey } from "../_actions/nav_actions"
import { getPost } from "../_actions/post_actions"
import { getFollowUser } from "../_actions/user_actions"
import { getUserChats, addMessage, setMessages , previousMessages } from  "../_actions/chat_actions"
import { Button } from 'antd';
import WebSocketInstance from "../websocket";

function Home() {
    const history = useHistory()
    const [sideComponent, setSideComponent] = useState()
    
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.userData)
    const key = useSelector(state => state.nav.navKey)
    
    let jwtToken = window.localStorage.getItem('jwtToken')
    const headers = {Authorization: `JWT ${jwtToken}`}

    const handleComponent = (key) => {
        if (key === 1) {
            dispatch(getPost('/api/posts/', headers))
        } else if (key === 2) {
            let params = {username: userData.data.user.username}
            dispatch(getPost('/api/posts/', headers, params))
            setSideComponent(newPost)
        } else if (key === 3) {
            setSideComponent(following)
        } else if (key === 4) {
            setSideComponent(_ChatSidepanel)
        } 
    }

    useEffect(() => {
        handleComponent(key)
    }, [key])
    
    const handleSidebar = (key) => {
        if (key.key === '1') {
            dispatch(navKey(1))
        } else if (key.key === '2') {
            dispatch(navKey(2))
        } else if (key.key === '3') {
            dispatch(navKey(3))
        } else if (key.key === '4') {
            dispatch(navKey(4))
        } else if (key.key === '5') {
            dispatch(navKey(5))
        }
    }
    
    const handleClick = () => {
        history.push('/post/new');
    }
    
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
    
    const _ChatSidepanel = (
        <>
            <ChatSidepanel />
        </>
    )
    
    const following = (
        <>
            <FollowingList />
        </>
    )

    const _setMessages = (avatar_url, messages) => dispatch(setMessages(avatar_url, messages))
    const _addMessage = message => dispatch(addMessage(message))
    const _previousMessages = messages => dispatch(previousMessages(messages))
    
    useEffect(() => {
        dispatch(getPost('/api/posts/', headers))
        dispatch(getUserChats(userData.data.user.username, jwtToken))
        dispatch(getFollowUser('/account/following/', headers))
        WebSocketInstance.addCallbacks(
            _setMessages, _addMessage, _previousMessages
        )
        setSideComponent(newPost)
    }, [])
    
    return (
        <AppLayout sidebar={sideComponent} side={handleSidebar}>
            {key === 4 ? <Chat />
                : <PostList />
            }
        </AppLayout>
    )
}

export default Home;
