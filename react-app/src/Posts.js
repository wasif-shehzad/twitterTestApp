import React from "react";
import './App.css';

function Posts({items}) {
  let posts = [];
  items = items.filter((v,i,a)=>a.findIndex(t=>(t.timespan === v.timespan))===i)
  items = items.sort((a, b) => b.timespan - a.timespan);
  items.forEach((i) => {
    posts.push(<div key={i.timespan}>
        <span className="h7 float-right">{new Date(i.timespan).toLocaleString()}</span>
        <div className="heading h2">
        {i.text}
        </div>
        <hr className="style7"/>
        </div>)
  });
  return posts;
}

export default Posts;
