import React, { useState } from "react";
import { Card, Form, Input, Button, notification } from "antd";
import { useHistory, useLocation} from "react-router-dom";
import { axiosInstance } from "api";
//import Axios from 'axios';
//import useLocalStorage from 'utils/useLocalStorage';
import {useAppContext, setToken} from 'store';
import { parseErrorMessages } from "utils/forms";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

//arrow function
const Login = () => {
  const {store, dispatch} = useAppContext();
  const history = useHistory();
  const location = useLocation();
  //const [jwtToken, setJwtToken] = useLocalStorage('jwtToken', '');
  const [fieldErrors, setFieldErrors] = useState({});

  const {from: loginRedirectUrl} = location.state || {from: {pathname: '/'}};
  
  const onFinish = values => {
    async function fn() {
      const { username, password } = values;
      setFieldErrors({});
      
      const data = { username, password };
      try {
        const response = await axiosInstance.post("/account/token/", data);
        
        //const {data:token} = response;  //response 의 data 를 token 변수에 넣은것
        //const token = response.data;
        //const {data:{token}} = response;  //response.data 의 token 을 token 변수에 넣은것
        //const token = response.data.token;
        const {data:{token:jwtToken}} = response;
        //const jwtToken = response.data.token;  //response.data 의 token 을 jwtToken 변수에 넣은것
        
        //setJwtToken(jwtToken);
        dispatch(setToken(jwtToken));
        
        notification.open({
          message: "로그인 성공",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />
        });

        history.push(loginRedirectUrl);
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "로그인 실패",
            description: "아이디/암호를 확인해주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />
          });

          const { data: fieldsErrorMessages } = error.response;
          setFieldErrors(
            //Object.entries(fieldsErrorMessages).reduce(
              //(acc, [fieldName, errors]) => {
                //acc[fieldName] = {
                  //validateStatus: "error",
                  //help: errors.join(" ")
                //};
                //return acc;
              //},
              //{}
            //)
            parseErrorMessages(fieldsErrorMessages)
          );
        }
      }
    }
    fn();
  };
  
  return (
    <Card title='로그인'>
      <Form
        {...layout}
        onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete={"false"}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
            { min: 4, message: "4글자 이상 입력해주세요." }
          ]}
          hasFeedback
          {...fieldErrors.username}
          {...fieldErrors.non_field_errors}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          {...fieldErrors.password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default Login;
