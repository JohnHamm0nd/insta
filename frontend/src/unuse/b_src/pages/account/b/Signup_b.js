import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {useHistory} from 'react-router-dom';
import {Alert} from 'antd';


function Signup() {
    //회원가입 후 페이지 이동을 위해 useHistory 사용
    const history = useHistory();
    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('');
    //username, password 를 하나의 오브젝트에서 사용
    const [inputs, setInputs] = useState({username: '', password: ''});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formDisabled, setFormDisabled] = useState(true);
    
    const onSubmit = (e) => {
        e.preventDefault();
        //loading 을 true 로 변경
        setLoading(true);
        //요청을 보내기 전에 errors 초기화
        setErrors({});
        console.log('onSubmit:', inputs);
        Axios.post('http://localhost:8000/account/signup/', inputs)
            .then(response => {
                //회원가입 성공 시 account/login 페이지로 이동
                history.push('/account/login');
            })
            .catch(error => {
                //console.log('error: ', error);
                if (error.response) {
                    //console.log(error.response)
                    setErrors({
                        username: (error.response.data.username || []).join(''),
                        password: (error.response.data.password || []).join('')
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }
    
    
    useEffect(() => {
        //username 이나 password 의 길이가 하나라도 0 이면 버튼을 비활성화
        //const isDisabled = inputs.username.length === 0 || inputs.password.length === 0;
        //setFormDisabled(isDisabled);
        //username 과 password 의 길이가 모두 1 이상 일 때 버튼을 활성화
        const isEnabled = Object.values(inputs).every(s => s.length > 0);
        setFormDisabled(!isEnabled);
    }, [inputs]);
    
    const onChange = e => {
        const {name, value} = e.target;
        //[name] 은 배열을 뜻하는게 아님
        //정확한 이름은 모름, [변수명] 을 사용하면 변수명 안의 값을 변수명으로 사용 가능
        //onChange 에서 받아온 name 이 username 이냐 password 이냐에 따라서 username,passwrod 에 가져온 value 를 넣음
        //useState 에서 하나의 오브젝트로 값을 관리하는 경우 이전 상태값을 받아서 같이 넣어줘야함(그렇지 않으면 항상 이전값이 없어짐: username 을 쓰고, password 를 쓰면 username 을 가져오지 않아서 없어진다)
        //inputs 를 직접 받아오는 것 보다 이전값을 인자로 받아서(리액트에서 제공하는 기본기능인듯) 처리하는게 좋다
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    }
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type='text'
                        name='username'
                        onChange={onChange}
                    />
                    {errors.username && <Alert type='error' message={errors.username} />}
                </div>
                <div>
                    <input
                        type='text'
                        name='password'
                        onChange={onChange}
                    />
                    {errors.password && <Alert type='error' message={errors.password} />}
                </div>
                <input
                    type='submit'
                    value='회원가입'
                    disabled={loading || formDisabled}
                />
            </form>
        </div>
    )
}

export default Signup;
