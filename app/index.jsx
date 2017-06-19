// import {a} from './admin'
// console.log(a)

// console.log(888)

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(
  <App />, document.getElementById('root')
)

// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('root')
// );


// import { h, render } from 'preact';
// import App from './App.jsx';
// // import './index.css';

// render(<App />, document.getElementById('root'));

// // Set up HMR re-rendering.
// FuseBox.addPlugin({
//   hmrUpdate: ({ type, path, content }) => {
//     if (type === 'js') {
//       window.location.reload()
//       return true
//     }
//   }
// })


// var AWS = require('aws-sdk')





// var AmazonCognitoIdentity = require('amazon-cognito-identity-js')



// // Renders the page based on the current URL
// function renderApp() {
//   var content;
//   if (window.location.pathname === '/about') {
//     content = '<div>Welcome to the About page</div>'
//   } else if (window.location.pathname === '/') {
//     content = '<div>Welcome Serverless Developer :)</div>'
//   }

//   var main = document.getElementsByTagName('main')[0];
//   main.innerHTML = content;
// }

// // Navigate to another URL and re-render the application
// function navigate(evt) {
//   evt.preventDefault();
//   var href = evt.target.getAttribute('href');
//   window.history.pushState({}, undefined, href);
//   renderApp();
// }

// document.addEventListener('DOMContentLoaded', function(event) {
//   // Attach the event listener once the DOM has been loaded
//   var nav = document.getElementsByTagName('nav')[0];
//   nav.addEventListener("click", navigate, false);

//   // First initial App rendering
//   renderApp();
// });
