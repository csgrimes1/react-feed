import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  // class Square extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       value: null,
  //     };
  //   }

  //   render() {
  //     console.log('rendering this mutherr', this.state)
  //     return (
  //       <button className="square" onClick={() => this.setState({value: 'X'})}>
  //         {this.state.value}
  //       </button>
  //     );
  //   }
  // }
  
  // class Board extends React.Component {
  //   renderSquare(i) {
  //     return <Square value={i} />;
  //   }

  //   render() {
  //     const status = 'Next player: X';
  
  //     return (
  //       <div>
  //         <div className="status">{status}</div>
  //         <div className="board-row">
  //           {this.renderSquare(0)}
  //           {this.renderSquare(1)}
  //           {this.renderSquare(2)}
  //         </div>
  //         <div className="board-row">
  //           {this.renderSquare(3)}
  //           {this.renderSquare(4)}
  //           {this.renderSquare(5)}
  //         </div>
  //         <div className="board-row">
  //           {this.renderSquare(6)}
  //           {this.renderSquare(7)}
  //           {this.renderSquare(8)}
  //         </div>
  //       </div>
  //     );
  //   }
  // }
  
  // class Game extends React.Component {
  //   render() {
  //     return (
  //       <div className="game">
  //         <div className="game-board">
  //           <Board />
  //         </div>
  //         <div className="game-info">
  //           <div>{/* status */}</div>
  //           <ol>{/* TODO */}</ol>
  //         </div>
  //       </div>
  //     );
  //   }
  // }
  
  class Feedlink extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null,
      };
    }

    render() {
      if (this.props.selected) {
        return <li>{this.props.title}</li>
      }

      const onSelect = this.props.onSelect;
      return <li><button 
        className="feedlink"
        onClick={() => onSelect(this.props.url)}>{this.props.title}
      </button></li>
    }
  }

  const transformItem = (item) => {
    return {
      title: item.getElementsByTagName('title')[0].textContent,
      description: item.getElementsByTagName('description')[0].textContent,
      link: item.getElementsByTagName('link')[0].textContent,
    }
  }

  class Channel extends React.Component {
    constructor(props) {
      super(props)
      const elChannel = props.channelInfo;
      const items = Array.from(elChannel.getElementsByTagName('item'))
        .map(transformItem)
      this.state = {items}
    }

    renderItem(item, index) {
      const navigateTo = () => window.open(item.link, '_blank')
      return <button className="story" key={'story' + index} onClick={navigateTo}>
        <div className="story-title" dangerouslySetInnerHTML={{__html: item.title}}></div>
        <div dangerouslySetInnerHTML={{__html: item.description}}></div>
      </button>
    }

    render() {
      return <div>{this.state.items.map(this.renderItem)}</div>
    }
  }

  class Feeds extends React.Component {
    constructor () {
      super();
      this.state = {
        selected: -1,
        channels: [],
        feeds: [
          {title: 'ESPN Top News', url: 'https://crossorigin.me/http://www.espn.com/espn/rss/news'},
          {title: 'Google News', url: 'https://crossorigin.me/https://news.google.com/news/rss/?ned=us&gl=US&hl=en'},
          {title: 'Yahoo', url: 'https://crossorigin.me/https://www.yahoo.com/news/rss'},
          {title: 'Huffington Post', url: 'https://crossorigin.me/https://www.huffingtonpost.com/section/front-page/feed'},
          {title: 'ABC', url: 'https://crossorigin.me/http://abcnews.go.com/abcnews/topstories'},
        ]
      }
    }

    render() {
      const feedStates = this.state.feeds.map(
        (feed, index) => ({selected: index === this.state.selected, ...feed}));
      return (
        <table className="feed-table"><tbody>
          <tr>
            <td className="sources">
              <ul>
                {feedStates.map(feed => <Feedlink
                  key={feed.title}
                  title={feed.title}
                  url={feed.url}
                  selected={feed.selected}
                  onSelect={this.onFeedUpdate.bind(this)}
                />)}
              </ul>
            </td>
            <td className="stories">
              {this.state.channels.map((channel, index) => <Channel key={channel + index} channelInfo={channel} />)}
            </td>
          </tr>
        </tbody></table>
      )
    }

    onFeedUpdate(url) {
      const selectedIndex = this.state.feeds.findIndex(feed => feed.url === url);
      this.setState({...this.state, selected: selectedIndex, channels: []})
      fetch(url, { mode: 'cors' })
      .then(data => data.text())
      .then(text => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, "application/xml")
        const channels = Array.from(doc.getElementsByTagName('channel'))
        this.setState({...this.state, channels})
      })
      .catch(err => console.error('Error:', err))
    }
  }

  // ========================================
  
  ReactDOM.render(
    <Feeds />,
    document.getElementById('root')
  );
  