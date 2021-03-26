import React from 'react';
import CommentList from './CommentList';
import moment from 'moment';
import { useDispatch } from "react-redux"
import { navKey } from "../_actions/nav_actions"
import { getPost } from "../_actions/post_actions"
import { createOrChangeChat } from "../_actions/chat_actions"
import { Avatar, Button, Card, Carousel, Popconfirm, Popover, Tag } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import './Post.scss';


function Post({post, user, handleLike, handleEdit, handleDelete, handleCancel}) {
    const {author, image_set, caption, tag_set, is_like, created_at} = post
    const {username, avatar_url} = author
    
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
        <p style={{margin: '0px'}}><Button type="link" style={{padding:"0px"}} onClick={() => handleChat(username)}>Message 보내기</Button></p>
      </div>
    )
    
    return (
        <div className='post'>
            <Card
                cover={
                        <Carousel draggable>
                                {image_set.map((image, index) => <img className="image" key={index} src={image.image} alt={index} />)}
                        </Carousel>
                }
                actions={[
                    is_like ? (
                        <HeartFilled style={{color: '#F92672'}} onClick={() => handleLike({post, isLike: false})} />
                    ) : (
                        <HeartOutlined onClick={() => handleLike({post, isLike: true})} />
                    )
                ]}
                style={{marginBottom: '2em'}}
            >
                <Card.Meta
                    avatar={<Avatar icon={<img src={avatar_url} alt={username} />} alt={username} />}
                    title={
                            user === username ? (<>{username}</>
                            ) : (
                                <Popover
                                    content={content}
                                    overlayStyle={{textAlign:"center"}}
                                >
                                    <Button type="link" style={{padding: '0px', fontSize: "16px"}}>{username}</Button>
                                </Popover>
                            )
                          }
                    style={{marginBottom: '1em'}}
                />
                <pre className='caption'>{caption}</pre>
                <div className='tag'>{tag_set.map((tag, index) => <Tag key={index} color='processing'>{tag.value}</Tag>)}</div>
                <div className='moment'>{moment(created_at).fromNow()}</div>
                <div className='buttons'>
                    {user && user === username && 
                        <div>
                            <Button onClick={() => handleEdit({post})} style={{marginRight: '0.5rem'}}>수정</Button>
                            <Popconfirm
                                title="포스트를 삭제 하시겠습니까?"
                                onConfirm={() => handleDelete({post})}
                                onCancel={() => handleCancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>삭제</Button>
                            </Popconfirm>
                        </div>
                    }
                </div>
                <hr/>
                <CommentList post={post} />
                </Card>
        </div>
    )
}

export default Post;
