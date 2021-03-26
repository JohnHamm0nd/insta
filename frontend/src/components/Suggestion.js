import React from 'react';
import { getPost } from "../_actions/post_actions"
import { useDispatch } from "react-redux"
import { Avatar, Button } from 'antd';


export default function Suggestion({suggestionUser, onFollowUser}) {
    const dispatch = useDispatch()
    let jwtToken = window.localStorage.getItem('jwtToken')
    const headers = {Authorization: `JWT ${jwtToken}`}
    
    const {username, avatar_url} = suggestionUser
    
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
        </div>
    )
}
