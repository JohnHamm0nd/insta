import React,{useState, useEffect} from 'react';
import {Alert} from 'antd';
//import Axios from 'axios';
//import useAxios from 'axios-hooks';
import {axiosInstance, useAxios} from 'api';
import Post from './Post';
import {useAppContext} from 'store';


//const apiUrl = 'http://localhost:8000/api/posts/';

function PostList() {
    //요청 시 jwtToken 을 같이 보내기 위해 토큰을 가져옮
    const {store: {jwtToken}} = useAppContext();
    const [postList, setPostList] = useState([]);
    
       
    ////useEffect 뒤에 빈 리스트를 넣어주면 처음 mount 시에만 동작함 
    //useEffect(() => {
        ////Axios.get 은 promise 객체를 반환함, .then(), .catch() 를 통해서 정상동작, 에러를 구분해서 반환(400 미만은 .then(): 정상, 400 이상은 .catch(): 에러)  
        ////headers 에 jwtToken 넣어서 Axios.get 요청에 같이 넣어 보냄
        //const headers = {Authorization: `JWT ${jwtToken}`}
        //Axios.get(apiUrl, {headers})
            //.then(response => {
                ////응답을 response 로 받는데 이 안에 data 라는 이름으로 데이터가 있음
                ////console.log('loaded response:', response);
                //setPostList(response.data);
            //})
            //.catch(error => {
                ////error.response
            //})
        //console.log('mounted');
    //}, []);
    
    //useAxios Hook 사용
    //헤더에 jwtToken 을 설정
    const headers = {Authorization: `JWT ${jwtToken}`};
    //요청을 보낼 url 지정
    //const apiUrl = '/api/posts/';
    //useAxios 훅을 통한 요청, 조회(읽기) 요청 일 때 사용하기 좋다(restful api 에서는 get)
    const [{data: originPostList, loading, error}, refetch] = useAxios({
        url: '/api/posts/',
        headers
        })
    
    useEffect(() => {
        //console.log(originPostList);
        setPostList(originPostList);
    }, [originPostList]);

    //PostNewForm 에서 새로운 포스트를 업로드 하였을 때
    //history.push or replace 를 통해서 다시 PostList 컴포넌트를 로딩하는데
    //이 때 PostList 컴포넌트가 먼저 그려져 있어 상태값이 유지되어 그런 것 같다고 함
    //refetch 를 통해서 다시 받아 오는 것으로 해결
    //어려운 방법이지만 커스텀 async await 를 만들어 useAxios 와 useEffect 를 만들어도 되지 않을까?
    //만약 PostList 가 먼저 그려져 있다고 하는것이 처음 메인페이지에서 받았던 컴포넌트와 데이터가 유지되는 것 이라면
    //이것을 지우고 다시 받아오면 되지 않을까?
    //업데이트 상태값을 만들어 두고 history.push 를 하고 인자로 업데이트 데이터를 넣어줌
    //useEffect 를 사용하여 인자가 바뀌면 useAxios 를 실행 하던가(어려움: 콜백 함수 안에 useAxios 를 못씀: 쓰려면 아마 커스텀 콜백함수? 를 만들어야한다고 하는 것 같음)
    //아니면 Axios 를 사용(이건 useEffect 안에서 사용 할 수 있는듯)
    
    useEffect(() => {
        refetch();
    }, []);

    const handleLike = async ({post, isLike}) => {
        const apiUrl = `/api/posts/${post.id}/like/`;
        const method = isLike ? 'POST' : 'DELETE';
        
        try {
            const response = await axiosInstance({
                url: apiUrl,
                method,
                headers,
            })
            //refetch 를 사용하여 전체 포스트를 다시 받아오기
            //refetch(); 
            //상태값(포스트)을 지정하고 for 문을 돌아(map) 상태값이 변했는지 체크하여 전환
            setPostList(prevList => {
                return prevList.map(currentPost => 
                    currentPost === post ? {...currentPost, is_like: isLike}: currentPost
                );
            });
        } catch(error) {
            
        }
    }
    
    return (
        <div>
            {postList && postList.length === 0 && <Alert type='warning' message='포스팅이 없습니다.' />}
            {postList && postList.map(post => <Post post={post} key={post.id} handleLike={handleLike} />)}
        </div>
    )
}

export default PostList;
