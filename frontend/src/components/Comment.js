import React from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux"
import { navKey } from "../_actions/nav_actions"
import { getPost } from "../_actions/post_actions"
import { createOrChangeChat } from  "../_actions/chat_actions"
import { Avatar, Button, Comment as AntdComment, Tooltip, Popover } from 'antd';


export default function Comment({comment}) {
    
    const {author:{username, avatar_url}, message, created_at} = comment;
    const userData = useSelector(state => state.user.userData)
    const dispatch = useDispatch()
    
    const getUserPost = (username) => {
        const params = {username}
        const jwtToken = window.localStorage.getItem('jwtToken')
        const headers = {Authorization: `JWT ${jwtToken}`}
        dispatch(getPost('/api/posts/', headers, params))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleChat = (addUser) => {
        dispatch(createOrChangeChat(addUser))
        dispatch(navKey(4))
    }
    
    const content = (
      <div>
        <p><Button type="link" style={{padding:"0px"}} onClick={() => getUserPost(username)}>Post 보기</Button></p>
        <p style={{margin: '0px'}}><Button style={{padding:"0px"}} type="link" onClick={() => handleChat(username)}>Message 보내기</Button></p>
      </div>
    )
    
    return (
        <AntdComment
            author={
                    userData && userData.data.user.username === username ? (<>{username}</>
                        ) : (
                            <Popover
                                content={content}
                                //~ trigger="click"
                                overlayStyle={{textAlign:"center"}}
                            >
                                <a>{username}</a>
                            </Popover>
                        )
                    }
            avatar={
                <Avatar
                  src={avatar_url}
                  alt={username}
                />
            }
            content={
                <p>
                  {message}
                </p>
            }
            datetime={
                <Tooltip title={moment().format(created_at)}>
                    <span>{moment(created_at).fromNow()}</span>
                </Tooltip>
            }
        />
    )
}
