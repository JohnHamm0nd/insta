import React from 'react'
import { getPost } from "../_actions/post_actions"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Button, Card } from 'antd'
import './Suggestion.scss'


const FollowingList = () => {
    
    const dispatch = useDispatch()
    let jwtToken = window.localStorage.getItem('jwtToken')
    const headers = {Authorization: `JWT ${jwtToken}`}
    const followUserList = useSelector(state => state.user.followUser)
    
    const getUserPost = (username) => {
        let params = {username}
        dispatch(getPost('/api/posts/', headers, params))
    }
  
    return (
        <div>
            <Card title="Following Users" size="small">
                {followUserList &&
                    followUserList.data.map((followUser, index) => (
                        <div key={index}>
                            <Avatar size='small' icon={
                                <img
                                    src={followUser.avatar_url}
                                    alt={`${followUser.username}`}
                                />
                            }/>
                            <Button type="text" onClick={() => getUserPost(followUser.username)} >
                                {followUser.username}
                            </Button>
                        </div>
                    ))
                }
            </Card>
        </div>
    )
}

export default FollowingList;
