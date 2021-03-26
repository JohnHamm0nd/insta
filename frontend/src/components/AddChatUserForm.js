import React, { useState } from "react";
import { Avatar, Button, Form, Select, Spin } from "antd";
import { axiosInstance } from '../api';
import debounce from 'lodash/debounce';
import { useDispatch } from "react-redux"
import { closeAddChatPopup } from  "../_actions/nav_actions"
import { createOrChangeChat } from  "../_actions/chat_actions"


const AddChatUserForm = () => {
	
	let jwtToken = window.localStorage.getItem('jwtToken')
	const headers = {Authorization: `JWT ${jwtToken}`}
	
	const [addUserState, setaddUserState] = useState({data: [], username: [], searching: false})
	
	const dispatch = useDispatch()
	
	const searchUser = value => {
    setaddUserState({ data: [], searching: true });
    
    axiosInstance.get('account/users/', {headers, params : {search: value}})
       .then(response => {
			const data = response.data.map(user => ({
				username: user.username,
				avatar_url: user.avatar_url,
			}));
			setaddUserState({ data, searching: false });
        
      });
  };
	
	const handleChange = value => {
		if ( value.length ) {
		  setaddUserState({
			  username : value[0].value,
			  data: [],
			  searching: false,
		})
		} else {
			setaddUserState({
			  username : value,
			  data: [],
			  searching: false,
		})
		}
    }

	const handleSubmit = e => {
		const addUser = addUserState.username
		dispatch(createOrChangeChat(addUser))
		dispatch(closeAddChatPopup())
	}
	
	return (
		<Form layout="inline" onFinish={handleSubmit}>
        <Form.Item
        >
            <Select
              mode="multiple"
			  labelInValue
              style={{ width: "200px" }}
              placeholder="Select users"
              notFoundContent={addUserState.searching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={debounce(searchUser, 500)}
              onChange={handleChange}
            >
              {addUserState.data.map(d => (
				<Select.Option key={d.username}>
					<Avatar size='small' style={{marginRight: '4px'}} icon={
						<img
							src={d.avatar_url}
							alt={`${d.username}`}
						/>
					}/>
					{d.username}
				</Select.Option>
			  ))}
            </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            Start a chat
          </Button>
        </Form.Item>
      </Form>
	)
}

export default AddChatUserForm
