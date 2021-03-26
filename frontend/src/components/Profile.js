import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { navKey } from "../_actions/nav_actions"
import { createOrChangeChat } from  "../_actions/chat_actions"
import { Avatar, Button, Card, Popover } from 'antd'

export default function Profile({user, profileUserName, followUserList, avatar_url, bio, follow, unFollow}) {
    
    const history = useHistory()
    const profile = {avatar_url, bio}
    const dispatch = useDispatch()
    const handleEditProfile = ({profile}) => {
        history.push({pathname: `/profile`, state: { profile }})
    }
    
    const handleChat = (addUser) => {
        dispatch(createOrChangeChat(addUser))
        dispatch(navKey(4))
    }
    
    const content = (
      <div>
        <Button type="link" style={{padding:"0px"}} onClick={() => {handleChat(profileUserName)}}>Message 보내기</Button>
      </div>
    )

    return (
        <div style={{marginBottom: '1rem'}}>
            <Card
                title={
                    user === profileUserName ? (<>{profileUserName}</>
                    ) : (
                        <Popover
                            content={content}
                            overlayStyle={{textAlign:"center"}}
                        >
                            <Button type="link" size="large" style={{padding:"0px"}}>{profileUserName}</Button>
                        </Popover>
                    )
                }
                extra={
                    user === profileUserName ? <Button onClick={() => handleEditProfile({profile})}>수정</Button> :
                    followUserList.find(followUser => followUser.username === profileUserName) ? (
                        <Button type='primary' onClick={() => unFollow(profileUserName)}>Unfollow</Button>
                    ) : (
                        <Button type='primary' onClick={() => follow(profileUserName)}>Follow</Button>
                    )
                }
            >
                <Card.Grid hoverable={false} style={{width: '30%', height: '200px', textAlign: 'center'}}>
                    <Avatar size={128} style={{marginTop:'0.5rem'}} icon={
                        <img
                            src={avatar_url}
                            alt={`${profileUserName}`}
                        />
                    }/>
                </Card.Grid>
                <Card.Grid hoverable={false} style={{width: '70%', height: '200px'}}>
                    {bio}
                </Card.Grid>
            </Card>
        </div>
    )
}



