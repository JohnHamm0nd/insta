import React from 'react';
import { getPost } from "../_actions/post_actions"
import { useDispatch } from "react-redux"
import {Avatar, Button} from 'antd';


export default function Suggestion({suggestionUser, onFollowUser}) {
    //SuggestionList 으로 내보내는게 더 좋겠다(dispatch, getUserPost 함수)
    const dispatch = useDispatch()
    let jwtToken = window.localStorage.getItem('jwtToken')
    const headers = {Authorization: `JWT ${jwtToken}`}
    
    const {username, avatar_url, is_follow} = suggestionUser
    
    const getUserPost = (username) => {
        let params = {username}
        dispatch(getPost('/api/posts/', headers, params))
    }
    
    return (
        <div>
            <Avatar size='small' icon={
                <img
                    src={avatar_url}
                    alt={`${username}`}
                />
                
            }/>
            <Button type="text" onClick={() => getUserPost(username)} >
                {username}
            </Button>
            {/*
            <div className='action'>
                {is_follow && '팔로잉 중'}
                {!is_follow && <Button onClick={() => onFollowUser(username)}>Follow</Button>}
            </div>
            */}
        </div>
    )
}
