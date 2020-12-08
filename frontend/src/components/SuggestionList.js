import React, {useState, useEffect, useMemo} from 'react';
import Suggestion from './Suggestion';
import {Card} from 'antd';
//import Axios from 'axios';
//import useAxios from 'axios-hooks';
import {axiosInstance, useAxios} from 'api';
import {useAppContext} from 'store';
import './SuggestionList.scss';


//arrow function
const SuggestionList = ({style}) => {
    //요청을 보낼 때 필요한 jwtToken 을 가져옮
    //const {store: {jwtToken}} = useAppContext();
    let jwtToken = window.localStorage.getItem('jwtToken')
    
    const [userList, setUserList] = useState([]);
    
    //useAxios 를 사용하므로 필요없음
    //const [userList, setUserList] = useState([]);
    ////마운트 될 때 실행
    //useEffect(()=> {
        ////async await 사용 : 함수로 사용해야 하므로 함수를 만들고 함수 안에 작얼할 내용을 넣음
        //async function fetchUserList() {
            ////요청을 보낼 url 지정
            //const apiUrl = 'http://localhost:8000/account/suggestions/';
            ////헤더에 jwtToken 을 넣음
            //const headers = {Authorization: `JWT ${jwtToken}`};
            ////apiUrl 로 headers 를 넣어서 요청을 보냄
            //try {
                //const {data} = await Axios.get(apiUrl, {headers})
                //setUserList(data);
            //}
            //catch(error) {
                //console.log(error);
            //}
        //}
        //fetchUserList();
    //}, []);
    
    //헤더에 jwtToken 을 설정
    const headers = {Authorization: `JWT ${jwtToken}`};
    //요청을 보낼 url 지정
    const apiUrl = '/account/suggestions/';
    //useAxios 훅을 통한 요청, 조회(읽기) 요청 일 때 사용하기 좋다(restful api 에서는 get)
    const [{data: originUserList, loading, error}, refetch] = useAxios({url: apiUrl, headers});

    //유저가 Follow 를 누르면 해당 유저를 Follow 해야 하므로 is_follow(false) 라는 데이터를 추가
    //useMemo 는 지정한 오브젝트?(뒤에 지정해줌 [변수명], 여기에서는 originUserList) 값이 바뀔 때에만
    //안에 있는 코드를 실행해 준다
    //const userList = useMemo(() => {
        //if (!originUserList) return [];
        //return originUserList.map(user => ({...user, is_follow: false}));
    //}, [originUserList]);
    
    useEffect(() => {
        //if (!originUserList) 
            //setUserList([]);
        //else setUserList(originUserList.map(user => ({...user, is_follow: false})));
        //console.log(originUserList)
        if (originUserList)
            setUserList(originUserList.results.map(user => ({...user, is_follow: false})));
    }, [originUserList]);

    //const onFollowUser = (username) => {
        //setUserList(prevUserList => {
            //return prevUserList.map(user => {
                //if (user.username === username) {
                    //return {...user, is_follow: true}
                //}
                //else
                    //return user;
            //});
        //});
    //}
    
    //위와 같은 코드, {} 를 생략하고 바로 리턴하는 방법, 삼항연산자
    //const onFollowUser = (username) => {
        //axiosInstance.post('/account/follow/', {username}, {headers})
            //.then(response => {
                //setUserList(prevUserList => 
                    //prevUserList.map(user => 
                        //user.username !== username ? user : {...user, is_follow: true}
                    //)
                //);
            //})
            //.catch(error => {
                //console.error(error);
            //})
    //};
    
    return (
        <div style={style}>
            {loading && <div>Loading...</div>}
            {error && <div>로딩 중 에러 발생</div>}
            <Card title="Suggestions for you" size="small">
            {userList.map(suggestionUser => (
                <Suggestion
                    key={suggestionUser.username}
                    suggestionUser={suggestionUser}
                    //onFollowUser={onFollowUser}
                />
            ))}
            </Card>
        </div>
    )
}

export default SuggestionList;
