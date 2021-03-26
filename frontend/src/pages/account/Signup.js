import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../_actions/user_actions";
import { useDispatch } from "react-redux";
import './form.css';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Signup() {
  
  const dispatch = useDispatch();
  const history = useHistory();
  const [fieldErrors, setFieldErrors] = useState({});

  const onFinish = values => {
    const { username, password } = values;
    setFieldErrors({});
    
    const dataToSubmit = { username, password };
    
    dispatch(registerUser(dataToSubmit)).then(response => {
      if (response.payload.status === 201) {
        notification.open({
          message: "회원가입 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />
        })
        history.push("/account/login");
      } else if (response.payload.status === 400) {
        notification.open({
          message: "회원가입 실패",
          description: "아이디/암호를 확인해주세요.",
          icon: <FrownOutlined style={{ color: "#ff3333" }} />
        })
        const { data: fieldsErrorMessages } = response.payload
        setFieldErrors(
          Object.entries(fieldsErrorMessages).reduce(
            (acc, [fieldName, errors]) => {
              acc[fieldName] = {
                validateStatus: "error",
                help: errors.join(" ")
              };
              return acc;
            },
            {}
          )
        )
      }
    })
  }

  return (
    <div className="form">
      <Form
        style={{ minWidth: '400px' }}
        {...formItemLayout}
        onFinish={onFinish}
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
          rules={[
                { required: true, message: "Please input your password!" },
          ]}
          {...fieldErrors.password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

