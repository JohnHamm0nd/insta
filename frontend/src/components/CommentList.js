import React, {useState} from 'react';
//import Axios from 'axios';
//import useAxios from 'axios-hooks';
import {axiosInstance, useAxios} from 'api';
import {useAppContext} from 'store';
import Comment from './Comment';
import {Button, Input} from 'antd';


export default function CommentList({post}) {
        
    //요청 시 jwtToken 을 같이 보내기 위해 토큰을 가져옮
    //const {store: {jwtToken}, dispatch} = useAppContext();
    let jwtToken = window.localStorage.getItem('jwtToken')
    
    const [commentContent, setCommentContent] = useState('');
    
    
    //헤더에 jwtToken 을 설정
    const headers = {Authorization: `JWT ${jwtToken}`};
    //useAxios 훅을 통한 요청, 조회(읽기) 요청 일 때 사용하기 좋다(restful api 에서는 get)
    const [{data: commentList, loading, error}, refetch] = useAxios({
        url: `/api/posts/${post.id}/comments/`,
        headers
    });
    
    const handleCommentSave = async () => {
        const apiUrl = `/api/posts/${post.id}/comments/`
        try {
            const response = await axiosInstance.post(apiUrl, {message: commentContent}, {headers});
            setCommentContent('');
            refetch();
        } catch (error) {
            
        }
    }
    return (
        <div>
            {/*
                처음 혹은 댓글이 없을 때? 에는 commentList 가 없으므로 map 함수에서 에러가 남 -> 조건문을 넣어 commentList 가 있을 때 동작
            */}
            {/*
                정렬 사용 시 서버에서 정렬하여 보내거나 클라이언트에서 받아서 정렬 할 수 있음. reverse() 함수 등
            */}
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
