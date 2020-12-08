import React from 'react';
import CommentList from './CommentList';
import moment from 'moment';
import {Avatar, Card, Carousel, Modal, Tag} from 'antd';
import {HeartOutlined, HeartFilled, UserOutlined} from '@ant-design/icons';
import './Post.scss';


function Post({post, handleLike}) {
    const {author, image_set, caption, location, tag_set, like_user_set, is_like, created_at} = post;
    const {username, avatar_url} = author;
    
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
                <div className='tag'>{tag_set.map((tag, index) => <Tag key={index} color='#17A2B8'>{tag.name}</Tag>)}</div>
                <div className='moment'>{moment(created_at).fromNow()}</div>
                {/* {like_user_set} */}
                <hr/>
                <CommentList post={post} />
                </Card>
        </div>
    )
}

export default Post;
