import React, { useState, useEffect } from 'react';
import {Button, Form, Input, Modal, Upload, notification} from 'antd';
import {getBase64FromFile} from 'utils/base64';
import {parseErrorMessages} from "utils/forms";
//import Axios from 'axios';
import {axiosInstance} from 'api';
//import {useAppContext} from 'store';
import { useHistory, useLocation } from 'react-router-dom';
import {FrownOutlined, PlusOutlined} from '@ant-design/icons';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};


//Post 에서 수정을 누르면 state or post 에서 해당 데이터를 받아와야 함(사진이 잘 될지 모르겠음)
//수정인지, 생성인지 여부에 따라서 PUT, POST 요청을 해야함
export default function PostNewForm() {
  //jwtToken 가져오기
  //const {store:{jwtToken}} = useAppContext();
  let jwtToken = window.localStorage.getItem('jwtToken')
  const history = useHistory()
  const location = useLocation()
  
  
  const prePost = location.state
  //console.log(location.state)
  
  const tags = []
  const files = []
  
  if (prePost) { 
    //console.log(prePost)
    
    prePost.post.tag_set.forEach(tag => tags.push('#'+tag.value))
    prePost.post.image_set.forEach((image,index) => files.push({uid:image.id, url:image.image}))
  }
  
  
  //console.log(files)
  
  //useEffect(() => {
    //console.log(location.state.post)
  //}, [])

  //파일 업로드 관련 상태값
  const [fileList, setFileList] = useState(files)
  //console.log(fileList)
  
  //프리뷰 관련 상태값, 파일을 올리면 base64 로 인코딩 하여 프리뷰로 보여줌
  const [previewPhoto, setPreviewPhoto] = useState({
    visible: false,
    base64: null
  });
  //에러 관련 상태값
  const [fieldErrors, setFieldErrors] = useState({});
  
  const handleUpload = ({fileList}) => {
    setFileList(fileList)
    //console.log(fileList)
  }
  
  const handlePreviewPhoto = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64FromFile(file.originFileObj);
    }
    setPreviewPhoto({
      visible: true,
      base64: file.url || file.preview
    });
  }
  
  //fieldValues 로 글과 사진을 받아 서버로 업로드 요청
  const handleFinish = async fieldValues => {
    //console.log(fieldValues)
    const {caption, location, tags, image: {fileList}} = fieldValues
    //const {caption, location, tags, image} = fieldValues
    
    //자바스크립트 Form Data API 로 객체를 만들어 데이터를 넣음
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('tags', tags);
    
    //사진의 경우 여러장 있을 수 있으므로 forEach
    //console.log(fileList)
    //console.log(image)
    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('image', file.originFileObj)
      } else if (file.uid) {
        formData.append('image', file.uid)
      }
      //console.log(file)
    })
    //인증정보가 필요 하므로 headers 에 jwtToken 을 가져옮
    const headers = {Authorization: `JWT ${jwtToken}`}
    try {
      if (prePost) {
        const response = await axiosInstance.put(`/api/posts/${prePost.post.id}/`, formData, {headers})
      } else {
        const response = await axiosInstance.post('/api/posts/', formData, {headers})
      }
      //console.log(response.data)
      //setTimeout(await function() {
        //history.replace('/')
      //}, 9000);
      history.replace('/');
    } catch (error) {
      if (error.response) {
        const {status, data: fieldsErrorMessages} = error.response;
        if (typeof fieldsErrorMessages === 'string') {
          notification.open({
            message: "서버 오류",
            description: `에러) ${status} 응답을 받았습니다.`,
            icon: <FrownOutlined style={{ color: "#ff3333" }} />
          });
        } else {
          setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        }
      }
    }
  };

  return (
    <Form
      {...layout}
      onFinish={handleFinish}
      //   onFinishFailed={onFinishFailed}
      autoComplete={"false"}
    >
      <Form.Item
        label="Caption"
        name="caption"
        rules={[
          { required: true, message: "Please input your Caption!" },
        ]}
        initialValue={prePost && prePost.post.caption}
        hasFeedback
        {...fieldErrors.caption}
        {...fieldErrors.non_field_errors}
      >
        <Input.TextArea rows={10} />
      </Form.Item>

      <Form.Item
        label="Location"
        name="location"
        rules={[
          { required: true, message: "Please input your Location!" },
        ]}
        initialValue={prePost && prePost.post.location}
        hasFeedback
        {...fieldErrors.location}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        label="Tags"
        name="tags"
        initialValue={prePost && tags.join(' ')}
      >
        <Input placeholder="ex) #Apple #Google" />
      </Form.Item>

      <Form.Item
        label='Image'
        name='image'
        rules={[{required: true, message: '사진을 업로드해 주세요.'}]}
        initialValue={prePost && {fileList}}
        hasFeedback
        {...fieldErrors.image}
        {...fieldErrors.non_field_errors}
      >
        <Upload
          listType='picture-card'
          //defaultFileList={[...files]}
          fileList={fileList}
          beforeUpload={() => {
            return false;
          }}
          onChange={handleUpload}
          onPreview={handlePreviewPhoto}
        >
          {/* 최대 사진 수 5장 제한 5장 업로드를 하면 업로드 버튼이 없어진다.(하지만 백엔드에서 제한하지 않고 있으므로 확실하게 제한하려면 백엔드에서도 제한이 필요하다) */}
          {fileList.length > 4 ? null : (
            <div>
              <PlusOutlined />
              <div className='ant-upload-text'>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Modal visible={previewPhoto.visible} footer={null} closable={false} onCancel={() => setPreviewPhoto({visible:false})}>
        <img src={previewPhoto.base64} style={{width:'100%'}} alt='Preview' />
      </Modal>
    </Form>
  )
}

