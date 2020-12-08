import React from 'react';
import {axiosInstance} from 'api';
import CommentList from './CommentList';
import moment from 'moment';
import {Avatar, Button, Card, Carousel, Modal, Popconfirm, Tag} from 'antd';
import {HeartOutlined, HeartFilled, UserOutlined} from '@ant-design/icons';
import './Post.scss';


function Post({post, user, handleLike, handleEdit, handleDelete, handleCancel}) {
    const {author, image_set, caption, location, tag_set, like_user_set, is_like, created_at} = post
    const {username, avatar_url} = author
    
    return (
        <div className='post'>
            <Card
                hoverable
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
                    avatar={<Avatar icon={<img src={avatar_url} />} alt={username} />}
                    title={location}
                    //description={<pre>{caption}</pre>}
                    style={{marginBottom: '1em'}}
                />
                <pre className='caption'>{caption}</pre>
                <div className='tag'>{tag_set.map((tag, index) => <Tag key={index} color='processing'>{tag.value}</Tag>)}</div>
                <div className='moment'>{moment(created_at).fromNow()}</div>
                {/* {like_user_set} */}
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
