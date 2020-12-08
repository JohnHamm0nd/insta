import React, { useState } from 'react';
import { axiosInstance } from '../api';
import debounce from 'lodash/debounce';
import { AutoComplete, Input } from 'antd';
import { getPost } from "../_actions/post_actions"
import { useDispatch } from "react-redux"

//debounce
//입력을 늦춰주는 라이브러리
//input 을 통해 서버에 쿼리 요청을 보내고 결과을 받는데, onChange(여기에서는 onSearch) 은 입력값이 하나 바뀔 때 마다 동작을 함
//그래서 apple 을 입력하면 글자수 대로 서버에 쿼리를 보냄(매우 불필요하고, 서버에도 좋지 않고, 프론트에서도 딱히 좋은점이 없음)
//debounce 를 사용하면 입력한 시간부터 설정한 시간이 지나면 작동하게 함. 설정한 시간이 1초(1000) 이라면 apple 를 1초 안에 치면 apple 한번의 쿼리를 서버에 보내게 됨 

//const mockVal = (str, repeat = 1) => {
  //return {
    //value: str.repeat(repeat),
  //};
//};

function Search() {
  
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  
  let jwtToken = window.localStorage.getItem('jwtToken')
  const headers = {Authorization: `JWT ${jwtToken}`}
  
  const onSearch = (searchText) => {
    //console.log(headers)
    //console.log('onSearch', searchText);
    //값이 변경될 때 마다 실행된다.
    //서버로 쿼리를 보내 자동완성 목록을 받아와 목록 만들기
    //axiosInstance.get('/api/posts/tag', {headers: {Authorization: `JWT ${jwtToken}`}, params : {search: searchText}})
      //.then(response => {
        //console.log(response.data)
      //})
    //setOptions(
      //!searchText ? [] : [],
    //);
    
    if (searchText) {
      let tags = []
      axiosInstance.get('/api/posts/tag', {headers, params : {search: searchText}})
       .then(response => {
          //console.log(response.data)
          {response.data.length ? setOptions(response.data)
            : setOptions([{value: 'No results found.'}])
          }
         })
         //console.log(tags)
         //setOptions([{value: 'asfsa'}])
    } else {
      setOptions([])
      dispatch(getPost('/api/posts/', headers))
    }

  };

  //const onSelect = (data) => {
    ////여기서 값을 선택 했을때 서버로 쿼리를 보내면 된다
    ////여기는 post 로 검색 쿼리를 보내는것
    //console.log('onSelect', data)
    //axiosInstance.get('/api/posts/', {headers: {Authorization: `JWT ${jwtToken}`}, params : {search: data}})
      //.then(response => {
        //console.log(response.data)
      //})
  //};

  //const onChange = (data) => {
    //setValue(data);
    //console.log('onChange', value);
    //여기에서 값이 변경 되었을 때 axios 를 사용하여 서버로 쿼리를 보내면 된다
    //결과값을 onSearch 에 넣어 검색어 자동완성
    //onChange 나 onSearch 나 여기에선 거의 같은 동작
    //onSearch 사용
  //}
  
  const onSelect = (tag) => {
    //여기서 값을 선택 했을때 서버로 쿼리를 보내면 된다
    //여기는 post 로 검색 쿼리를 보내는것
    //console.log('onSelect', tag)
    //axiosInstance.get('/api/posts/', {headers: {Authorization: `JWT ${jwtToken}`}, params : {search: tag}})
      //.then(response => {
        ////console.log(response.data)
        //setPostList(response.data)
      //})
      //getPosts('/api/posts/', 0, {search: tag})
      let params = {search:tag}
      dispatch(getPost('/api/posts/', headers, params))
  }
  
    
  return (
    <div>
      <AutoComplete
        options={options}
        onSelect={onSelect}
        onSearch={debounce(onSearch, 800)}
      >
        <Input.Search placeholder="Tag Search" />
      </AutoComplete>
    </div>
  )
}

export default Search;
