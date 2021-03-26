import React from 'react';
import {Route} from 'react-router-dom';
import Home from './Home';
import PostNew from './PostNew';
import ProfileUpdateForm from 'components/ProfileUpdateForm';
import About from './About';
import AccountRoutes from './account';
import LoginRequiredRoute from 'utils/LoginRequiredRoute';
import { useDispatch, useSelector } from "react-redux"
import { authUser } from "../_actions/user_actions"

function Root() {
    
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isAuthenticated)
    const isLoaded = useSelector(state => state.user.isLoaded)
    
    if (!isAuthenticated) {
        dispatch(authUser())
    }
    
    return (
        <>
            {isLoaded && <LoginRequiredRoute exact path='/' component={Home} isAuthenticated={isAuthenticated} />}
            {isLoaded && <LoginRequiredRoute exact path='/post' component={PostNew} isAuthenticated={isAuthenticated} />}
            {isLoaded && <LoginRequiredRoute exact path='/post/:postId' component={PostNew} isAuthenticated={isAuthenticated} />}
            {isLoaded && <LoginRequiredRoute exact path='/profile' component={ProfileUpdateForm} isAuthenticated={isAuthenticated} />}
            {isLoaded && <Route exact path='/about' component={About} />}
            {isLoaded && <Route path='/account' component={AccountRoutes} />}
        </>
    )
}

export default Root;

