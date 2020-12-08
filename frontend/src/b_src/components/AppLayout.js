import React from 'react';
//import AppHeader from './AppHeader';
//import AppFooter from './AppFooter';
import {Input, Menu} from 'antd';
import './AppLayout.scss';
import LogoImage from 'assets/logo.png';
//webpack 에서 작은 이미지의 경우 base64 로 인코딩하여 넘기고, 큰 이미지는 URL 주로를 넘기게 설정되어 있다고함


function AppLayout({children, sidebar}) {
    return (
        <div className='app'>
            {/*<AppHeader />*/}
            <div className='header'>
                <h1 className='page-title'>
                    <img src={LogoImage} alt='logo' />
                </h1>
                <div className='search'>
                    <Input.Search />
                </div>
                <div className='topnav'>
                    <Menu mode='horizontal'>
                        <Menu.Item>Menu1</Menu.Item>
                        <Menu.Item>Menu2</Menu.Item>
                        <Menu.Item>Menu3</Menu.Item>
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
