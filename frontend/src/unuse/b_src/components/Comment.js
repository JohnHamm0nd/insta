import React from 'react';
import moment from 'moment';
import {Avatar, Comment as AntdComment, Tooltip} from 'antd';


export default function Comment({comment}) {
    const {author:{username, avatar_url}, message, created_at} = comment;
    return (
        <AntdComment
            author={username}
            avatar={
                <Avatar
                  src={avatar_url}
                  alt={username}
                />
            }
            content={
                <p>
                  {message}
                </p>
            }
            datetime={
                <Tooltip title={moment().format(created_at)}>
                    <span>{moment(created_at).fromNow()}</span>
                </Tooltip>
            }
        />
    )
}
