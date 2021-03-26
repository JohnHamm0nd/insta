import React, { useState } from 'react';
import { Button, Form, Input, Modal, Upload, notification } from 'antd';
import { getBase64FromFile } from 'utils/base64';
import { parseErrorMessages } from "utils/forms";
import { axiosInstance } from 'api';
import { useHistory, useLocation } from 'react-router-dom';
import { FrownOutlined, PlusOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};


export default function PostNewForm() {

  let jwtToken = window.localStorage.getItem('jwtToken')
  const history = useHistory()
  const location = useLocation()
  const prePost = location.state
  const tags = []
  const files = []
  
  if (prePost) { 
    prePost.post.tag_set.forEach(tag => tags.push('#'+tag.value))
    prePost.post.image_set.forEach((image,index) => files.push({uid:image.id, url:image.image}))
  }
  
  const [fileList, setFileList] = useState(files)

  const [previewPhoto, setPreviewPhoto] = useState({
    visible: false,
    base64: null
  });
  const [fieldErrors, setFieldErrors] = useState({});
  
  const handleUpload = ({fileList}) => {
    setFileList(fileList)
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
  
  const handleFinish = async fieldValues => {
    const {caption, location, tags, image: {fileList}} = fieldValues
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('tags', tags);

    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('image', file.originFileObj)
      } else if (file.uid) {
        formData.append('image', file.uid)
      }
    })

    const headers = {Authorization: `JWT ${jwtToken}`}
    try {
      if (prePost) {
        await axiosInstance.put(`/api/posts/${prePost.post.id}/`, formData, {headers})
      } else {
        await axiosInstance.post('/api/posts/', formData, {headers})
      }
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
        hasFeedback
        {...fieldErrors.image}
        {...fieldErrors.non_field_errors}
      >
        <Upload
          listType='picture-card'
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

