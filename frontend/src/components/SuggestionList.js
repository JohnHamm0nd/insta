import React, { useState, useEffect } from 'react';
import Suggestion from './Suggestion';
import { Card } from 'antd';
import { useAxios } from 'api';
import './SuggestionList.scss';


const SuggestionList = ({style}) => {

    let jwtToken = window.localStorage.getItem('jwtToken')
    const [userList, setUserList] = useState([]);
    const headers = {Authorization: `JWT ${jwtToken}`};
    const apiUrl = '/account/suggestions/';
    const [{data: originUserList, loading, error}] = useAxios({url: apiUrl, headers});
    
    useEffect(() => {
        if (originUserList)
            setUserList(originUserList.results.map(user => ({...user, is_follow: false})));
    }, [originUserList]);

    
    return (
        <div style={style}>
            {loading && <div>Loading...</div>}
            {error && <div>로딩 중 에러 발생</div>}
            <Card title="Suggestions for you" size="small">
            {userList.map(suggestionUser => (
                <Suggestion
                    key={suggestionUser.username}
                    suggestionUser={suggestionUser}
                />
            ))}
            </Card>
        </div>
    )
}

export default SuggestionList;
