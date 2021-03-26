import React from 'react';
import { Menu } from 'antd';
import './AppLayout.scss';
import LogoImage from 'assets/logo.png';
import Search from 'components/Search';
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../_actions/user_actions"
import { useHistory } from 'react-router-dom';
function AppLayout({children, sidebar, side}) {
    
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isAuthenticated)
    const history = useHistory()
    
    const handleLogout = () => {
        dispatch(logoutUser)
        history.push('/account/login')
    }
    
    return (
        <div className='app'>
            <div className='header'>
                <h1 className='page-title'>
                    <a href='/'><img src={LogoImage} alt='logo' /></a>
                </h1>
                <div className='search'>
                    <Search side={side}/>
                </div>
                <div className='topnav'>
                    <Menu mode='horizontal'>
                        <Menu.Item key='1' onClick={side}>Post</Menu.Item>
                        <Menu.Item key='2' onClick={side}>ME</Menu.Item>
                        <Menu.Item key='3' onClick={side}>Following</Menu.Item>
                        <Menu.Item key='4' onClick={side}>Chat</Menu.Item>
                        {isAuthenticated && <Menu.Item key='5' onClick={handleLogout}>Logout</Menu.Item>}
                    </Menu>
                </div>
            </div>
            <div className='contents'>{children}</div>
            <div className='sidebar'>
                {sidebar}
            </div>
            <div className='footer'>
                &copy; 2020. Instagram Clone.
            </div>
        </div>
    )
}

export default AppLayout;
