import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import hashMultipleWords from '../utilities/hashMultipleWords';
import teamNames from '../utilities/teamNames';
import Tooltip from './Tooltip';

const compareHashes = (wordHashes, wordArray, startIndex = 0) => {
    let wordHashesVal = wordHashes;
    let result = {
        endIndex: -1,
        meta: {},
    };

    for (let i = startIndex; i < wordArray.length; i++) {
        const word = wordArray[i];

        if (!wordHashesVal[word]) {
            result.endIndex = -1;
            break;
        }
        if (wordHashesVal[word].leaf === true) {
            const meta = wordHashesVal[word];
            const keys = Object.keys(meta);
            result.endIndex = i;
            
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === 'leaf') continue;

                if (typeof meta[keys[i]] === 'boolean'
                || typeof meta[keys[i]] === 'number'
                || typeof meta[keys[i]] === 'string') {
                    result.meta[keys[i]] = meta[keys[i]];
                }
            }
            break;
        }
        wordHashesVal = wordHashesVal[word];
    }

    return result;
}

const nonAlphabeticRegex = /([^A-Za-z ].*)+/;
const getNoneAlphabeticPart = (str) => {
    const match = nonAlphabeticRegex.exec(str);

    if (match != null) {
        return match[0];
    }
    return '';
}

const wrapWordIntoComponent = (paragraph, params) => {
    const words = paragraph.split(' ');
    let wrappedContent = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let wrapped = false;

        for (const param of params) {
            if (param.keyword.hasOwnProperty(word)) {
                const { keyword } = param;
                const result = compareHashes(keyword, words, i);

                if (result.endIndex !== -1) {
                    const gibberishSuffix = getNoneAlphabeticPart(words[result.endIndex]); // usually a trailling dot or comma
                    let matchWords = '';

                    for (let j = i; j <= result.endIndex; j++) {
                        if (j === result.endIndex) {
                            matchWords += words[j].replace(gibberishSuffix, '');
                        } else {
                            matchWords += words[j] + ' ';
                        }
                    }

                    const Component = param.component;
                    wrappedContent.push(<Component key={i} {...param.props} {...result.meta}>{matchWords}</Component>);
                    wrappedContent.push(' ' + gibberishSuffix);
                    i = result.endIndex;
                    wrapped = true;
                    break;
                }
            }
        }

        if (!wrapped) {
            wrappedContent.push(word + ' ');
        } else {
            wrappedContent.push(' ');
        }
    }
    return wrappedContent;
}

const highlightWordInContent = (content, keyword) => {
    let params = [{
        component: Tooltip,
        props: { className: 'hint-text' },
        keyword: teamNames,
    }];

    if (keyword) {
        params.push({
            component: 'span',
            props: { className: 'search-result' },
            keyword,
        });
    }
    return wrapWordIntoComponent(content, params);
};

const NewsListItem = (props) => {
    const { highlightedWords } = props;
    const hashedQuery = highlightedWords.length > 0 ? hashMultipleWords(props.highlightedWords) : undefined;
    // TODO: remove
    // const hashedQuery = hashMultipleWords('has lost');

    const t0 = performance.now();
    const title = highlightWordInContent(props.title, hashedQuery);
    const description = highlightWordInContent(props.description, hashedQuery);
    const content = props.content && highlightWordInContent(props.content.replace(/\[.*\]$/, ''), hashedQuery);
    const t1 = performance.now();
    console.log("Call took " + (t1 - t0) + " milliseconds.");

    const publishedAt = moment(props.publishedAt).format('HH:mm DD/MM/YYYY');

    return (
        <a className='news-list-item' href={props.url} target='_blank'>
            <div className='news-list-item__image'>
                <img alt='article' src={props.urlToImage} />
            </div>
            <div className='news-list-item__text'>
                <span className='news-list-item__source'>{props.source.name}</span>
                <span className='news-list-item__date'>{publishedAt}</span>
                <h2>{title}</h2>
                <h3>{description}</h3>
                <div>{content}</div>
            </div>
        </a>
    );
}

NewsListItem.propTypes = {
    highlightedWords: PropTypes.string,
};

NewsListItem.defaultProps = {
    highlightedWords: '',
};

export default NewsListItem;
