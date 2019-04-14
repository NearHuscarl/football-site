import React from 'react';
import moment from 'moment';

const NewsListItem = (props) => {
    const publishedAt = moment(props.publishedAt).format('HH:mm DD/MM/YYYY');
    const content = props.content && props.content.replace(/\[.*\]$/, '');

    return (
        <a className='newslist-item' href={props.url} target='_blank'>
            <div className='newslist-image'>
                <img alt='article' src={props.urlToImage} />
            </div>
            <div className='newslist-text'>
                <span className='newslist-text__source'>{props.source.name}</span>
                <span className='newslist-text__date'>{publishedAt}</span>
                <h2>{props.title}</h2>
                <h3>{props.description}</h3>
                <div>{content}</div>
            </div>
        </a>
    );
}

export default NewsListItem;
