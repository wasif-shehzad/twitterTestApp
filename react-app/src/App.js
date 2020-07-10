import React, {Component} from "react";
import './App.css';
import Posts from "./Posts";
import axios from 'axios';

const API_URL = 'http://localhost';

class App extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      posts: [],
      temp: [],
      newFeeds: 0,
      lastUpdatedPostTimeSpan: 0
    }
  }

  componentDidMount() {
    this.getUpdates();
    setInterval(() => {
      this.getUpdates()
    }, 15000);
  }

  showFeeds() {
    let {temp, posts, newFeeds} = this.state;
    if (newFeeds > 0) {
      this.setState({posts: [...posts, ...temp], temp: [], newFeeds: 0});
    }
    return;
  }

  async getUpdates() {
    let {lastUpdatedPostTimeSpan, temp} = this.state;
    try {
      const response = await axios.get(`${API_URL}/updates/${lastUpdatedPostTimeSpan}`);
      let posts = response.data.posts;
      let timeSpan = posts[posts.length - 1]?.timespan || 0;
      if (timeSpan) {
        if (this.state.posts.length) {
          let temps = [...temp, ...posts];
          temps = temps.filter((v,i,a)=>a.findIndex(t=>(t.timespan === v.timespan))===i)
          this.setState({temp: temps, newFeeds: temps.length, lastUpdatedPostTimeSpan: timeSpan});
        } else {
          this.setState({posts: [...this.state.posts, ...posts], lastUpdatedPostTimeSpan: timeSpan});
        }

      } else {
        this.setState({posts: [...this.state.posts, ...posts]});
      }
    } catch (exception) {

    }
  }

  async addPost() {
    try {
      let timeSpan = new Date().getTime();
      let post = {
        text: this.input.current.value,
        timespan: timeSpan
      };
      this.setState({posts:[...this.state.posts,post]})
      const response = await axios.post(`${API_URL}/add`, {post}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.input.current.value = '';
    } catch (exception) {

    }
  }

  render() {
    let {posts, newFeeds} = this.state;
    return (
        <div className="row">
        <div className="container-fluid col-12">
        <div className="h3 float-right" onClick={() => this.showFeeds()}>
  <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
        <path fill-rule="evenodd"
    d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg>
        <br/>
        <div className="text-danger h6">{newFeeds}</div>
        </div>
        <div className="text-center">
        <h3>Create Post</h3>
    <textarea className="" type="text" ref={this.input}/>
    <br/>
    <button className="btn btn-primary" onClick={(e) => this.addPost()}> post</button>
    </div>

    <div className="ml-5 p-3 border bg-light  mr-5">
        <Posts items={posts}/>
    </div>

    </div>
    </div>
  )
  }
}

export default App;
