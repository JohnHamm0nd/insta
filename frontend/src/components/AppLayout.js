import React from 'react';
import { Link } from 'react-router-dom';
//import AppHeader from './AppHeader';
//import AppFooter from './AppFooter';
import {Input, Menu} from 'antd';
import './AppLayout.scss';
import LogoImage from 'assets/logo.png';
//webpack 에서 작은 이미지의 경우 base64 로 인코딩하여 넘기고, 큰 이미지는 URL 주로를 넘기게 설정되어 있다고함
import Search from 'components/Search';

function AppLayout({children, sidebar, side}) {
    return (
        <div className='app'>
            {/*<AppHeader />*/}
            <div className='header'>
                <h1 className='page-title'>
                    <a href='/'><img src={LogoImage} alt='logo' /></a>
                </h1>
                {/*
                <div className='search'>
                    <Input.Search placeholder='Search' />
                    <Search />
                </div>
                */}
                <div className='search'>
                    <Search />
                </div>
                <div className='topnav'>
                    <Menu mode='horizontal'>
                        <Menu.Item key='1' onClick={side}>Post</Menu.Item>
                        <Menu.Item key='2' onClick={side}>MyPost</Menu.Item>
                        <Menu.Item key='3' onClick={side}>Following</Menu.Item>
                        <Menu.Item key='4' onClick={side}>Chat</Menu.Item>
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
            {/*<AppFooter />*/}
        </div>
    )
}

export default AppLayout;
