import React from 'react';
import {Route} from 'react-router-dom';
import Home from './Home';
import PostNew from './PostNew';
import About from './About';
import AccountRoutes from './account';
//import AppLayout from 'components/AppLayout';
import LoginRequiredRoute from 'utils/LoginRequiredRoute';
//임포트 시 폴더명을 지정하면 폴더 안에 있는 index.js 파일을 불러온다
//export default 지정 시 기본으로 export 되는 함수이며, 원하는 이름으로 가져외 사용 가능하다


function Root() {
    return (
        //하위 컴포넌트로 문자열, 함수, 오브젝트, (컴포넌트도 넘어가는듯함) 등 넘길 수 있고 하위 컴포넌트에선 속성값으로 받아서 사용
        //props 로 받아야 하는 건지 사용자가 인자를 지정하는지 잘 모름,
        //children 만 사용하려면 children 으로 바로 받아서 사용
        <>
            {/*조건문처럼 사용되는듯, AppLayout 등 다른 컴포넌트들은
                항상 랜더링 되고 Route 주소 설정에 따라 설정한 컴포넌트만 랜더링
            */}
            <Route exact path='/' component={Home} />
            <Route exact path='/post' component={PostNew} />
            <Route exact path='/post/:postId' component={PostNew} />
            <Route exact path='/about' component={About} />
            <Route path='/account' component={AccountRoutes} />
        </>
    )
}

export default Root;
