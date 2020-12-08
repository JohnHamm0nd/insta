import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "api";
//import Axios from 'axios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};


export default function Signup() {
  const history = useHistory();
  const [fieldErrors, setFieldErrors] = useState({});

  const onFinish = values => {
    //async await 사용
    async function fn() {
      //values 를 바로 넘겨도 되지만, username, password 를 가져와 보냄 data 로 만들어 보냄
      //어떤 작업을 하고 있는지, 어떤 데이터를 보내고 있는지 명시적으로 볼 수 있게
      const { username, password } = values;
      //fieldErrors 초기화(비움)
      setFieldErrors({});
      
      const data = { username, password };
      try {
        await axiosInstance.post("/account/signup/", data);

        notification.open({
          message: "회원가입 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />
        });

        history.push("/account/login");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "회원가입 실패",
            description: "아이디/암호를 확인해주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />
          });

          const { data: fieldsErrorMessages } = error.response;
          //fieldsErrorMessages => { username: "m1 m2", password: [] }
          //python: mydict.items()
          //fieldsErrorMessages => {username : ['문자열'], password: []}
          //error.response 데이터는 key:value 형식으로 문자열 데이터로 되어 있다
          //python: dict.items()
          //파이썬에서 사전 데이터의 .items() 와 같음
          setFieldErrors(
            Object.entries(fieldsErrorMessages).reduce(
              (acc, [fieldName, errors]) => {
                // errors : ["m1", "m2"].join(" ") => "m1 "m2"
                //errors: ['문자열1', '문자열2'].join('') => '문자열1 문자열2'
                //console.log(errors);
                acc[fieldName] = {
                  validateStatus: "error",
                  help: errors.join(" ")
                };
                return acc;
              },
              {}
            )
          );
        }
      }
    }
    fn();
  };

  return (
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
  );
}
