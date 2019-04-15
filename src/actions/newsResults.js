import NewsAPI from 'newsapi';
import shuffle from 'lodash/shuffle';
import { reduceFilters } from '../reducers/newsResults';
import Log from '../utilities/log';

const searchNews = (filters, results) => ({
    type: 'UPDATE_NEWS_RESULTS',
    filters,
    results,
});

export const setSearchNewsStatus = (isSearching) => ({
    type: 'SET_SEARCH_NEWS_STATUS',
    isSearching,
});

export const startSearchNews = () => {
    return (dispatch, getState) => {
        dispatch(setSearchNewsStatus(true));

        const filters = getState().newsFilters;
        const { newsResults } = getState();
        const cacheResults = newsResults.cache[reduceFilters(filters)];

        if (cacheResults) {
            dispatch(searchNews(filters, cacheResults));
            dispatch(setSearchNewsStatus(false));
            return Promise.resolve();
        }
        else {
            Log.warning('start search for news');
            const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
            // setTimeout(() => {
            //     dispatch(searchNews(filters, shuffle(mockArticles)));
            //     dispatch(setSearchNewsStatus(false));
            //     return Promise.resolve();
            // }, 2000);
    
            return newsapi.v2.everything({
                q: filters.text, 
                from: filters.startDate.format(),
                to: filters.endDate.format(),
                sources: filters.sources.toString(),
                pageSize: 100,
            })
            .then((response) => {
                const results = response.articles;
                dispatch(searchNews(filters, results));
                dispatch(setSearchNewsStatus(false));
            })
            .catch((err) => {
                console.log('startfilterNews:', err);
            });
        }
    }
}

const mockArticles = [
    {
        "source": {
            "id": "engadget",
            "name": "Engadget"
        },
        "author": "Rachel England",
        "title": "Square will offer its new crypto employees payment in Bitcoin",
        "description": "Payments startup Square is turning its attention to cryptocurrency. According to tweets from CEO Jack Dorsey, the company is hiring engineers and a designer to \"work full-time on open source contributions to the bitcoin/crypto ecosystem.\" #BitcoinTwitter and …",
        "url": "https://www.engadget.com/2019/03/21/square-will-offer-its-new-crypto-employees-payment-in-bitcoin/",
        "urlToImage": "https://o.aolcdn.com/images/dims?thumbnail=1200%2C630&quality=80&image_uri=https%3A%2F%2Fo.aolcdn.com%2Fimages%2Fdims%3Fcrop%3D4876%252C3584%252C0%252C0%26quality%3D85%26format%3Djpg%26resize%3D1600%252C1176%26image_uri%3Dhttps%253A%252F%252Fs.yimg.com%252Fos%252Fcreatr-images%252F2019-03%252Fd9c84040-4bc9-11e9-b3ff-31a53efd811d%26client%3Da1acac3e1b3290917d92%26signature%3D21e1a6ad3af11722ad08cb944c023fdd3c61f07f&client=amp-blogside-v2&signature=72000cc11529cea385ed8ecbdec6c9ceb02ca782",
        "publishedAt": "2019-03-21T12:21:00Z",
        "content": "#BitcoinTwitter and #CryptoTwitter! Square is hiring 3-4 crypto engineers and 1 designer to work full-time on open source contributions to the bitcoin/crypto ecosystem. Work from anywhere, report directly to me, and we can even pay you in bitcoin! Introducing… [+812 chars]"
    },
    {
        "source": {
            "id": "wired",
            "name": "Wired"
        },
        "author": "Gregory Barber",
        "title": "This Montana County Wants to Crimp Bitcoin to Save the Earth",
        "description": "Missoula County, Montana, commissioners are expected to approve a resolution that would require bitcoin mines to offset their energy use with renewables.",
        "url": "https://www.wired.com/story/montana-county-crimp-bitcoin-save-the-earth/",
        "urlToImage": "https://media.wired.com/photos/5ca543e975001c2e0effd055/191:100/pass/Mining-951884522.jpg",
        "publishedAt": "2019-04-04T11:00:00Z",
        "content": "Its a well-worn idea that bitcoin is helping to trash the planet, throwing fuel on an already burning world while providing value to very few people. By one recent estimate, the energy used to keep the network going, a process known as mining, is enough to po… [+6570 chars]"
    },
    {
        "source": {
            "id": "techcrunch",
            "name": "TechCrunch"
        },
        "author": "Anthony Ha",
        "title": "Daily Crunch: China considers Bitcoin mining ban",
        "description": "The Daily Crunch is TechCrunch’s roundup of our biggest and most important stories. If you’d like to get this delivered to your inbox every day at around 9am Pacific, you can subscribe here. 1. Regulators in China are weighing a ban on Bitcoin mining Cryptocu…",
        "url": "http://techcrunch.com/2019/04/09/daily-crunch-bitcoin-mining/",
        "urlToImage": "https://techcrunch.com/wp-content/uploads/2018/04/gettyimages-890799704.jpg?w=600",
        "publishedAt": "2019-04-09T16:28:18Z",
        "content": "The Daily Crunch is TechCrunch’s roundup of our biggest and most important stories. If you’d like to get this delivered to your inbox every day at around 9am Pacific, you can subscribe here.\r\n1. Regulators in China are weighing a ban on Bitcoin mining\r\nCrypto… [+2248 chars]"
    },
    {
        "source": {
            "id": "mashable",
            "name": "Mashable"
        },
        "author": "Jack Morse",
        "title": "Jack Dorsey is recruiting his own personal bitcoin posse",
        "description": "If reporting directly to an eccentric billionaire and getting paid in bitcoin sounds like your cup of tea, then does Jack Dorsey have an offer for you. On March 20, the CEO of both Twitter and Square made use of the former to announce a new and very specific …",
        "url": "https://mashable.com/article/jack-dorsey-bitcoin-cryptocurrency-square/",
        "urlToImage": "https://mondrian.mashable.com/2019%252F03%252F21%252F3b%252F1b490afea4a14a289d8bfdbbb7fcff34.2ad40.jpg%252F1200x630.jpg?signature=VF73pQkih9uvHjYWwwFLqiQRtRA=",
        "publishedAt": "2019-03-21T00:18:58Z",
        "content": "If reporting directly to an eccentric billionaire and getting paid in bitcoin sounds like your cup of tea, then does Jack Dorsey have an offer for you. \r\nOn March 20, the CEO of both Twitter and Square made use of the former to announce a new and very specifi… [+2442 chars]"
    },
    {
        "source": {
            "id": "mashable",
            "name": "Mashable"
        },
        "author": "Stan Schroeder",
        "title": "Bitcoin surges, hitting $5,000 for the first time this year",
        "description": "Bitcoin has been in a lull in recent months. The largest cryptocurrency's price kept declining throughout 2018, finally finding a bottom at roughly $3,200 last December. Since then, it's been a slow and shaky climb upwards. On Tuesday, however, the price of B…",
        "url": "https://mashable.com/article/bitcoin-5000-2019/",
        "urlToImage": "https://mondrian.mashable.com/2019%252F04%252F02%252Fd0%252Fbec1a15b67b446f0b4a4482dd15ec1e2.cb39d.jpg%252F1200x630.jpg?signature=NFAHtwl6AaI4jiwVObg6vLWz8LI=",
        "publishedAt": "2019-04-02T07:49:58Z",
        "content": "Bitcoin has been in a lull in recent months. The largest cryptocurrency's price kept declining throughout 2018, finally finding a bottom at roughly $3,200 last December. Since then, it's been a slow and shaky climb upwards. \r\nOn Tuesday, however, the price of… [+1895 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Gizmodo.com"
        },
        "author": "Matt Novak",
        "title": "Bitcoin Surges 15% Overnight Because Nobody Learned Their Lesson After the Last Crash",
        "description": "Bitcoin, the most popular cryptocurrency in the world, jumped to a four-month high overnight, briefly breaching $5,000 on the Bitstamp exchange. Bitcoin is up roughly 15% on the day and traders are excited because it really seems like nobody learned their les…",
        "url": "https://gizmodo.com/bitcoin-surges-15-overnight-because-nobody-learned-the-1833737971",
        "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/s--5z_GiR9k--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/hbrahmdeb5yjthzmbppo.jpg",
        "publishedAt": "2019-04-02T11:20:00Z",
        "content": "Bitcoin, the most popular cryptocurrency in the world, jumped to a four-month high overnight, briefly breaching $5,000 on the Bitstamp exchange. Bitcoin is up roughly 15% on the day and traders are excited because it really seems like nobody learned their les… [+2136 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Gizmodo.com"
        },
        "author": "Matt Novak",
        "title": "China Considers Ban on Cryptocurrency Mining Because It's a Stupid Waste of Energy",
        "description": "Regulators in China are considering a ban on cryptocurrency mining as an “undesirable” economic activity, according to a government document released Monday. Read more...",
        "url": "https://gizmodo.com/china-considers-ban-on-cryptocurrency-mining-because-it-1833904745",
        "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/s--L4Xg32mn--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/miap7wvsnnmjzdiruuqu.jpg",
        "publishedAt": "2019-04-09T10:30:00Z",
        "content": "Regulators in China are considering a ban on cryptocurrency mining as an undesirable economic activity, according to a government document released Monday.\r\nChinas National Development and Reform Commission (NDRC) published a new paper that includes a proposa… [+2227 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Gizmodo.com"
        },
        "author": "Bryan Menegus",
        "title": "Ring of Thieves Swipes $150,000 From Buggy Bitcoin ATMs, and Police Can't Figure Out Who They Are",
        "description": "A group of bitcoin bandits hit paydirt by taking advantage of buggy cryptocurrency ATMs in seven Canadian cities, according to police, netting a $195,000 CAN score—about $150,000 U.S. And Toronto police are asking for help identifying the suspects. Read more.…",
        "url": "https://gizmodo.com/ring-of-thieves-swipes-150-000-from-buggy-bitcoin-atms-1833291429",
        "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/s--JoeFeY8w--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/tjqry1u2zphw0deh9ko1.jpg",
        "publishedAt": "2019-03-14T16:20:00Z",
        "content": "A group of bitcoin bandits hit paydirt by taking advantage of buggy cryptocurrency ATMs in seven Canadian cities, according to police, netting a $195,000 CAN scoreabout $150,000 U.S. And Toronto police are asking for help identifying the suspects.\r\nThe fraudu… [+790 chars]"
    },
    {
        "source": {
            "id": "bbc-news",
            "name": "BBC News"
        },
        "author": "https://www.facebook.com/bbcnews",
        "title": "Why are Venezuelans seeking refuge in crypto-currencies?",
        "description": "As Venezuela staggers under political and economic crises, its citizens are embracing digital money.",
        "url": "https://www.bbc.co.uk/news/business-47553048",
        "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/14D4/production/_106023350_pic_2.jpg",
        "publishedAt": "2019-03-19T00:05:37Z",
        "content": "Image copyrightMegan JanetskyImage caption\r\n Eli Meregote uses crypto-currencies to send money home to Venezuela\r\nCrypto-currencies have faced a lot of criticism since Bitcoin first came on the scene 10 years ago. But for one group of people, they're proving … [+6304 chars]"
    },
    {
        "source": {
            "id": "ars-technica",
            "name": "Ars Technica"
        },
        "author": "Timothy B. Lee",
        "title": "Chinese government proposes ban on bitcoin mining",
        "description": "It's unclear how quickly China will try to phase out cryptocurrency mining.",
        "url": "https://arstechnica.com/tech-policy/2019/04/chinese-government-proposes-ban-on-bitcoin-mining/",
        "urlToImage": "https://cdn.arstechnica.net/wp-content/uploads/2019/04/GettyImages-1020194172-760x380.jpg",
        "publishedAt": "2019-04-09T15:28:59Z",
        "content": "Enlarge/ Mining operations outside China, like this one in Russia, could benefit if the Chinese government cracks down on cryptocurrency mining.\r\n4 with 4 posters participating\r\nThe Chinese government is considering a nationwide ban on mining bitcoin and othe… [+2279 chars]"
    },
    {
        "source": {
            "id": "engadget",
            "name": "Engadget"
        },
        "author": "Christine Fisher",
        "title": "Silk Road 2 founder sentenced five years after the site was shut down",
        "description": "It's been nearly five years since the feds shut down Silk Road 2. But its founder is only now being sentenced to prison. According to Motherboard, Thomas White, also known as Dread Pirate Roberts 2 (DPR2) plead guilty to drug trafficking, money laundering and…",
        "url": "https://www.engadget.com/2019/04/12/silk-road-2-founder-sentenced-prison/",
        "urlToImage": "https://o.aolcdn.com/images/dims?thumbnail=1200%2C630&quality=80&image_uri=https%3A%2F%2Fo.aolcdn.com%2Fimages%2Fdims%3Fcrop%3D5000%252C3334%252C0%252C0%26quality%3D85%26format%3Djpg%26resize%3D1600%252C1067%26image_uri%3Dhttps%253A%252F%252Fs.yimg.com%252Fos%252Fcreatr-images%252F2018-12%252F31fe6620-03c4-11e9-b5e5-b85daae86473%26client%3Da1acac3e1b3290917d92%26signature%3D59eea3c5efe57b9914a503a36d22c885ee8936a5&client=amp-blogside-v2&signature=6be46c28121dcf90fb692f7e5364046afc1176e5",
        "publishedAt": "2019-04-12T17:41:00Z",
        "content": "In 2013, the FBI seized Silk Road, a notorious online marketplace that offered anonymous drug and gun sales. Its creator Ross Ulbricht was later sentenced to life in prison. White reportedly launched Silk Road 2 almost immediately after the original site came… [+697 chars]"
    },
    {
        "source": {
            "id": "mashable",
            "name": "Mashable"
        },
        "author": "Stan Schroeder",
        "title": "Elon Musk says Dogecoin is his favorite cryptocurrency",
        "description": "Elon Musk has a new favorite cryptocurrency. On Tuesday, after being (jokingly) called out as a potential candidate to become the CEO of Dogecoin, the Tesla CEO said that Dogecoin is \"his favorite currency.\" SEE ALSO: Tesla's latest Autopilot update warns dri…",
        "url": "https://mashable.com/article/elon-musk-dogecoin/",
        "urlToImage": "https://mondrian.mashable.com/2019%252F04%252F03%252F50%252Fbe2b88c2e63047478e3bf60d1001348a.2b013.jpg%252F1200x630.jpg?signature=Bd_UuY8Yr9IvwUvGgy0IuoZLY6U=",
        "publishedAt": "2019-04-03T10:12:18Z",
        "content": "Elon Musk has a new favorite cryptocurrency. \r\nOn Tuesday, after being (jokingly) called out as a potential candidate to become the CEO of  Dogecoin, the Tesla CEO said that Dogecoin is \"his favorite currency.\"\r\nSEE ALSO: Tesla's latest Autopilot update warns… [+1359 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Slashdot.org"
        },
        "author": "msmash",
        "title": "China Wants To Ban Bitcoin Mining",
        "description": "China's state planner wants to eliminate bitcoin mining in the country, according to a draft list of industrial activities the agency is seeking to stop in a sign of growing government pressure on the cryptocurrency sector. From a report: China is the world's…",
        "url": "https://slashdot.org/story/19/04/09/1741219/china-wants-to-ban-bitcoin-mining",
        "urlToImage": "https://a.fsdn.com/sd/topics/china_64.png",
        "publishedAt": "2019-04-09T17:39:00Z",
        "content": "The Fine Print: The following comments are owned by whoever posted them. We are not responsible for them in any way."
    },
    {
        "source": {
            "id": "techcrunch",
            "name": "TechCrunch"
        },
        "author": "David Riggs",
        "title": "How to file taxes on your cryptocurrency trades in a bear year",
        "description": "Fred traded cryptocurrencies last year. Unfortunately, his trading yielded a capital loss of more than $35,000. Filing taxes could add another headache in a few weeks if not done correctly.",
        "url": "http://techcrunch.com/2019/03/28/how-to-file-taxes-on-your-cryptocurrency-trades-in-a-bear-year/",
        "urlToImage": "https://techcrunch.com/wp-content/uploads/2019/03/GettyImages-912808702.jpg?w=542",
        "publishedAt": "2019-03-28T19:00:31Z",
        "content": "Fred traded bitcoin, ether and a handful of other cryptocurrencies on Gemini, Binance and Coinbase last year. Unfortunately, due to the crypto downturn, his trading yielded a capital loss of more than $35,000. He’s not alone the stories have been coming out r… [+4638 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Readwrite.com"
        },
        "author": "Alex Treece",
        "title": "10 Years After Bitcoin Began, are We Underestimating Crypto?",
        "description": "In the 10 years since Bitcoin was created, a lot has happened to cryptocurrency. Do we understand crypto any better? Are we underestimating it? Bitcoin, Blockchain, Ethereum, and even Satoshi Nakamoto went from obscurity to something we might see on mainstrea…",
        "url": "https://readwrite.com/2019/03/29/10-years-after-bitcoin-began-are-we-underestimating-crypto/",
        "urlToImage": "https://images.readwrite.com/wp-content/uploads/2019/03/10-Years-After-Bitcoin-Began-are-We-Underestimating-Crypto.jpg",
        "publishedAt": "2019-03-29T15:00:44Z",
        "content": "In the 10 years since Bitcoin was created, a lot has happened to cryptocurrency. Do we understand crypto any better? Are we underestimating it?\r\nCompletely new industries around cryptocurrency and blockchain technology sprung up. Investors and early adopters … [+6153 chars]"
    },
    {
        "source": {
            "id": "the-next-web",
            "name": "The Next Web"
        },
        "author": "Yessi Bello Perez",
        "title": "We shouldn’t care about companies accepting Bitcoin in 2019",
        "description": "Bitcoin – the original cryptocurrency – has been around for a decade, but it’s still struggling to achieve mainstream adoption despite some major companies accepting it as a payment method. I remember when Overstock.com became the first major online retailer …",
        "url": "https://thenextweb.com/hardfork/2019/03/20/we-shouldnt-care-about-companies-accepting-bitcoin-in-2019/",
        "urlToImage": "https://img-cdn.tnwcdn.com/image/hardfork?filter_last=1&fit=1280%2C640&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2019%2F03%2Fbitcoin-payments.jpg&signature=0230786d8e1a610aa3ee2311815e6798",
        "publishedAt": "2019-03-20T09:49:06Z",
        "content": "Bitcoin BTC the original cryptocurrency has been around for a decade, but its still struggling to achieve mainstream adoption despite some major companies accepting it as a payment method. \r\nI remember when Overstock.com became the first major online retailer… [+4277 chars]"
    },
    {
        "source": {
            "id": "business-insider",
            "name": "Business Insider"
        },
        "author": "Dan DeFrancesco",
        "title": "The first exchange to go live with bitcoin futures now isn't listing new contracts as another sign of the difficulty getting Wall Street interested in crypto",
        "description": "Cboe Global Markets announced late Thursday that it will stop listing new contracts of bitcoin futures. The Chicago-based exchange group, which was the first to launch a derivative for the cryptocurrency, said it is \"assessing its approach\" to how it handles …",
        "url": "https://www.businessinsider.com/cboe-to-not-list-new-contracts-for-bitcoin-futures-2019-3",
        "urlToImage": "https://amp.businessinsider.com/images/5c8beb9d113a50597836f1f9-750-375.jpg",
        "publishedAt": "2019-03-15T18:28:58Z",
        "content": "Cboe Global Markets, the first exchange group to launch bitcoin futures when it went live in December 2017, announced it was putting a hold on listing new bitcoin contracts. \r\n In a notice published late Thursday, the Chicago-based exchange group said it woul… [+1277 chars]"
    },
    {
        "source": {
            "id": "the-next-web",
            "name": "The Next Web"
        },
        "author": "David Canellis",
        "title": "Twitter CEO Jack Dorsey says he will pay you to work on Bitcoin full-time",
        "description": "Twitter CEO Jack Dorsey has made an offering to the cryptocurrency community: he will pay developers to work full-time on Bitcoin Core and other “cryptocurrency ecosystem” projects. Are you currently contributing to bitcoin-core or other crypto ecosystem proj…",
        "url": "https://thenextweb.com/hardfork/2019/03/20/twitter-jack-dorsey-will-pay-you-to-work-on-bitcoin/",
        "urlToImage": "https://img-cdn.tnwcdn.com/image/hardfork?filter_last=1&fit=1280%2C640&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2019%2F02%2Ftwitter-dorsey-bitcoin-blockchain-cryptocurrency.jpg&signature=4fd7da170506f89bdae8c93ff90c3719",
        "publishedAt": "2019-03-20T22:47:28Z",
        "content": "Twitter CEO Jack Dorsey has made an offering to the cryptocurrency community: he will pay developers to work full-time on Bitcoin BTC Core and other cryptocurrency ecosystem projects.\r\nAre you currently contributing to bitcoin-core or other crypto ecosystem p… [+1405 chars]"
    },
    {
        "source": {
            "id": "techcrunch",
            "name": "TechCrunch"
        },
        "author": "Romain Dillet",
        "title": "Coinbase launches debit card in the UK",
        "description": "When you buy cryptocurrencies on Coinbase, many users simply don’t know what to do with them. Customers in the U.K. can now get a good old plastic card and spend cryptocurrencies in-store and on any online website. This is a Visa card so it should work with a…",
        "url": "http://techcrunch.com/2019/04/10/coinbase-launches-debit-card-in-the-uk/",
        "urlToImage": "https://techcrunch.com/wp-content/uploads/2017/09/gettyimages-585288019.jpg?w=711",
        "publishedAt": "2019-04-10T23:01:26Z",
        "content": "When you buy cryptocurrencies on Coinbase, many users simply dont know what to do with them. Customers in the U.K. can now get a good old plastic card and spend cryptocurrencies in-store and on any online website.\r\nThis is a Visa card so it should work with a… [+1646 chars]"
    },
    {
        "source": {
            "id": "the-next-web",
            "name": "The Next Web"
        },
        "author": "Matthew Beedham",
        "title": "China wants to destroy ‘wasteful’ Bitcoin mining",
        "description": "China, one of the world’s most prominent blockchain and cryptocurrency forces, wants to put an end to “wasteful” Bitcoin mining. The National Development and Reform Commission (NDRC) has added cryptocurrency mining to its latest list of industries it wants to…",
        "url": "https://thenextweb.com/hardfork/2019/04/09/china-destroy-bitcoin-mining/",
        "urlToImage": "https://img-cdn.tnwcdn.com/image/hardfork?filter_last=1&fit=1280%2C640&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2019%2F04%2FPeoples_Bank_of_China.jpg&signature=ec70c89c8e0177e942e2f2050fb899f2",
        "publishedAt": "2019-04-09T08:17:14Z",
        "content": "China, one of the worlds most prominent blockchain and cryptocurrency forces, wants to put an end to wasteful Bitcoin BTC mining.\r\nThe National Development and Reform Commission (NDRC) has added cryptocurrency mining to its latest list of industries it wants … [+1544 chars]"
    }
]