import React, {useState} from 'react';
import {axiosInstance, useAxios} from 'api';
import Comment from './Comment';
import {Button, Input} from 'antd';


export default function CommentList({post}) {
        
    let jwtToken = window.localStorage.getItem('jwtToken')
    const [commentContent, setCommentContent] = useState('');
    const headers = {Authorization: `JWT ${jwtToken}`};
    
    const [{data: commentList}, refetch] = useAxios({
        url: `/api/posts/${post.id}/comments/`,
        headers
    });
    
    const handleCommentSave = async () => {
        const apiUrl = `/api/posts/${post.id}/comments/`
        try {
            await axiosInstance.post(apiUrl, {message: commentContent}, {headers});
            setCommentContent('');
            refetch();
        } catch (error) {
            
        }
    }
    return (
        <div>
            {commentList && commentList.results.map(comment => (
                <Comment key={comment.id} comment={comment} />
            ))}
            <Input.TextArea
                style={{marginTop: '1em', marginBottom: '0.5em'}}
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
            />
            <Button
                block
                type='primary'
                disabled={commentContent.length === 0}
                onClick={handleCommentSave}
            >
                댓글 쓰기
            </Button>
        </div>
    )
}
