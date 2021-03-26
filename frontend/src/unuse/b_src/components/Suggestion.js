import React from 'react';
import {Avatar, Button} from 'antd';
import './Suggestion.scss';


export default function Suggestion({suggestionUser, onFollowUser}) {
    const {username, avatar_url, is_follow} = suggestionUser
    return (
        <div className='suggestion'>
            <div className='avatar'>
            <Avatar size='small' icon={
                <img
                    src={avatar_url}
                    alt={`${username}`}
                />
                
            }/>
            </div>
            <div className='username'>
                {username}
            </div>
            <div className='action'>
                {is_follow && '팔로잉 중'}
                {!is_follow && <Button onClick={() => onFollowUser(username)}>Follow</Button>}
            </div>
            
        </div>
    )
}
