import React, { useState } from 'react';
import { axiosInstance } from '../api';
import debounce from 'lodash/debounce';
import { AutoComplete, Input } from 'antd';
import { getPost } from "../_actions/post_actions"
import { useDispatch } from "react-redux"

function Search({side}) {
  
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])
  
  let jwtToken = window.localStorage.getItem('jwtToken')
  const headers = {Authorization: `JWT ${jwtToken}`}
  
  const onSearch = (searchText) => {
    
    if (searchText) {
      axiosInstance.get('/api/posts/tag', {headers, params : {search: searchText}})
       .then(response => {
          {response.data.length ? setOptions(response.data)
            : setOptions([{value: 'No results found.'}])
          }
         })
    } else {
      setOptions([])
      dispatch(getPost('/api/posts/', headers))
    }

  };

  const onSelect = (tag) => {
      let params = {search:tag}
      dispatch(getPost('/api/posts/', headers, params))
      side({key:'5'})
  }
  
    
  return (
    <div>
      <AutoComplete
        options={options}
        onSelect={onSelect}
        onSearch={debounce(onSearch, 400)}
      >
        <Input.Search placeholder="Tag Search" />
      </AutoComplete>
    </div>
  )
}

export default Search;
