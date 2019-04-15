import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const highlightWordInContent = (content, word = '') => {
    if (word.length === 0) {
        return content;
    }
    const wordPattern = new RegExp(word, 'i');
    const contentWithoutKeyword = content.split(wordPattern);
    let highlightedContent = [];

    contentWithoutKeyword.forEach((sentence, index) => {
        highlightedContent.push(sentence);
        if (index < contentWithoutKeyword.length - 1) {
            highlightedContent.push(<strong key={index} className='search-result'>{word}</strong>);
        }
    });

    return highlightedContent;
};

const NewsListItem = (props) => {
    const { highlightedWord } = props;
    const title = highlightWordInContent(props.title, highlightedWord);
    const description = highlightWordInContent(props.description, highlightedWord);
    const content = props.content && highlightWordInContent(props.content.replace(/\[.*\]$/, ''), highlightedWord);
    const publishedAt = moment(props.publishedAt).format('HH:mm DD/MM/YYYY');
    
    return (
        <a className='newslist-item' href={props.url} target='_blank'>
            <div className='newslist-image'>
                <img alt='article' src={props.urlToImage} />
            </div>
            <div className='newslist-text'>
                <span className='newslist-text__source'>{props.source.name}</span>
                <span className='newslist-text__date'>{publishedAt}</span>
                <h2>{title}</h2>
                <h3>{description}</h3>
                <div>{content}</div>
            </div>
        </a>
    );
}

NewsListItem.propTypes = {
    highlightedWord: PropTypes.string,
};

export default NewsListItem;
