import React, { useState } from "react"
import { Card, Form, Input, Button, notification } from "antd"
import { useHistory, useLocation} from "react-router-dom"
import { axiosInstance } from "api"
import { loginUser } from "../../_actions/user_actions"
import { useDispatch } from "react-redux"
import { parseErrorMessages } from "utils/forms"
import { SmileOutlined, FrownOutlined } from "@ant-design/icons"
import './form.css'


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
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
}

//arrow function
const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [fieldErrors, setFieldErrors] = useState({})

  const {from: loginRedirectUrl} = location.state || {from: {pathname: '/'}}
  
  const onFinish = values => {
    
    const { username, password } = values
    setFieldErrors({});
    
    const dataToSubmit = { username, password }
    dispatch(loginUser(dataToSubmit)).then(response => {
      //console.log(response)
      if (response.payload.status == 200) {
        notification.open({
        message: "로그인 성공",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />
      })
      window.localStorage.setItem('username', values.username)
      window.localStorage.setItem('jwtToken', response.payload.data.token)
      history.push('/')
      } else if (response.payload.status === 400) {
        notification.open({
          message: "로그인 실패",
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
              }
              return acc
            },
            {}
          )
          , parseErrorMessages(fieldsErrorMessages)
        )
        }
      })
  }
  
  
  return (
    <div className="form">
      <Card title='로그인'>
        <Form
          style={{ minWidth: '400px' }}
          {...formItemLayout}
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

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login
