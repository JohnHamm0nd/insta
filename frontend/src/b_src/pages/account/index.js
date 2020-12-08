import React from 'react';
import {Route} from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';
//import LoginRequiredRoute from 'utils/LoginRequiredRoute';

import Auth from "../hoc/auth";

function Routes({match}) {
    //match 인자를 받아서(들어오는 Route 주소를 받음) 주소를 다 쓸 필요 없이 뒷부분만 추가하여 사용
    return (
        <>
            <Route exact path={match.url + '/profile'} component={Auth(Profile, true)} />
            <Route exact path={match.url + '/login'} component={Auth(Login, false)} />
            <Route exact path={match.url + '/signup'} component={Auth(Signup, false)} />
        </>
    )
}

export default Routes;
