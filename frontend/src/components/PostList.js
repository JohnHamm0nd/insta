import React,{useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Alert, Button, message} from 'antd'
import Post from './Post'
import Profile from './Profile'
import { followUser, unFollowUser } from "../_actions/user_actions"
import { loadMorePost, likePost, deletePost} from "../_actions/post_actions"
import { useDispatch, useSelector } from "react-redux"

function PostList(props) {
    
    let jwtToken = window.localStorage.getItem('jwtToken')
    const [DataUrl, setDataUrl] = useState('/api/posts/')
    const [params, setParams] = useState()
    
    const dispatch = useDispatch()
    const history = useHistory()
    const userData = useSelector(state => state.user.userData)
    const postList = useSelector(state => state.post.postList)
    const followUserList = useSelector(state => state.user.followUser)
    const headers = {Authorization: `JWT ${jwtToken}`};
    
    useEffect(() => {
        if (postList) {
            setDataUrl(postList.next)
        }
    }, [postList])
    
    const loadMoreHanlder = () => {
        dispatch(loadMorePost(DataUrl, headers, params)).then(response => {
        })
    }

    const handleLike = ({post, isLike}) => {
        const url = `/api/posts/${post.id}/like/`
        const method = isLike ? 'POST' : 'DELETE'
        dispatch(likePost(url, method, headers, post.id, isLike))
    }
    
    const handleEdit = ({post}) => {
        history.push({pathname: `/post/${post.id}`, state: { post }})
    }
    
    const handleDelete = ({post}) => {
        dispatch(deletePost(`/api/posts/${post.id}`, headers, post.id))
        message.success('포스트가 삭제되었습니다.');
    }
    
    const handleCancel = () => {
         message.error('삭제 취소!');
    }
    
        
    const follow = (profileUserName) => {
        dispatch(followUser('/account/follow/', headers, profileUserName))
    }
    
    const unFollow = (profileUserName) => {
        dispatch(unFollowUser('/account/unfollow/', headers, profileUserName))
    }
    
    return (
        <div>
            {postList && postList.username &&
                <div>
                    <Profile
                        user={userData && userData.data.user.username}
                        profileUserName={postList.username}
                        followUserList={followUserList && followUserList.data}
                        avatar_url={postList.avatar_url}
                        bio={postList.bio}
                        follow={follow}
                        unFollow={unFollow}
                    />
                </div>
            }
            <div>
            {postList && postList.results.length === 0 && <Alert type='warning' message='포스팅이 없습니다.' />}
            {postList && postList.results.map(post =>
                <Post
                    post={post}
                    key={post.id}
                    user={userData && userData.data.user.username}
                    handleLike={handleLike}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleCancel={handleCancel}
                />
            )}
            <br />
            {DataUrl &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={loadMoreHanlder}>더보기</Button>
                </div>
            }
            </div>
        </div>
    )
}

export default PostList
