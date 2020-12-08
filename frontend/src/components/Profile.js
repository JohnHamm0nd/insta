import React, { useState } from 'react';
import { Avatar, Button, Card, Popover } from 'antd'

export default function Profile({user, profileUserName, followUserList, avatar_url, bio, follow, unFollow}) {
    
    const [visible, setVisible] = useState(false)
    
    const handleVisibleChange = visible => {
        setVisible(visible)
    }
  
    return (
        <div style={{marginBottom: '1rem'}}>
            <Card
                title={
                    user === profileUserName ? (<>{profileUserName}</>
                    ) : (
                        <Popover
                            content="다른 기능"
                            title="Chat"
                            trigger="click"
                            visible={visible}
                            onVisibleChange={handleVisibleChange}
                            overlayStyle={{textAlign:"center"}}
                        >
                            <a href="#">{profileUserName}</a>
                        </Popover>
                    )
                }
                extra={
                    user === profileUserName ? <></> :
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



