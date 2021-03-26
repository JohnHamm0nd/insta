import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { axiosInstance } from 'api';
import { getBase64FromFile } from 'utils/base64';
import { parseErrorMessages } from "utils/forms";
import { Button, Card, Form, Input, Modal, notification, Upload } from 'antd';
import { FrownOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};


export default function ProfileUpdateForm () {
	
	let jwtToken = window.localStorage.getItem('jwtToken')
	
	const history = useHistory()
	
	const location = useLocation()
	const preProfile = location.state
	
	const [fieldErrors, setFieldErrors] = useState({})
	
	const [fileList, setfileList] = useState([{uid: 1, url: preProfile.profile.avatar_url}])
	
	const [previewPhoto, setPreviewPhoto] = useState({
		visible: false,
		base64: null
	})
	
	const handleUpload = ({fileList}) => {
		setfileList(fileList)
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
    const {bio} = fieldValues
    
    const formData = new FormData();
    formData.append('bio', bio);
    
	fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('avatar', file.originFileObj)
      }
    })
    const headers = {Authorization: `JWT ${jwtToken}`}
    try {
	  const response = await axiosInstance.put(`account/profile/`, formData, {headers})
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
    }
  
	const dummyRequest = ({ file, onSuccess }) => {
	  setTimeout(() => {
		onSuccess("ok");
	  }, 0);
	}

	return (
	
	<Card 
		title='프로필 수정'
		style={{width: '800px', margin:'20px auto'}}
	>
    <Form
      {...layout}
      onFinish={handleFinish}
      autoComplete={"false"}
    >
      <Form.Item
        label="Bio"
        name="bio"
        rules={[
          { required: true, message: "Please input your Bio!" },
        ]}
        initialValue={preProfile && preProfile.profile.bio}
      >
        <Input.TextArea rows={10} />
      </Form.Item>

      <Form.Item
        label='Avatar'
        name='avatar'
      >
        <ImgCrop rotate quality={0.4}>
			<Upload
			  customRequest={dummyRequest}
			  listType='picture-card'
			  fileList={fileList}
			  onChange={handleUpload}
			  onPreview={handlePreviewPhoto}
			>
			 {fileList.length > 0 ? null : (
				<div>
				  <PlusOutlined />
				  <div className='ant-upload-text'>Upload</div>
				</div>
			  )}
			</Upload>
		</ImgCrop>
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
    </Card>
  )

}

