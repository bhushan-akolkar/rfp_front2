import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Components/Login/Login';
import ChatUI from './Components/Chat/Chat';
import Register from './Components/Register/Register';
import Document from './Components/Similar_Document/Similar_Document';

// import SignInPage from './Components/Register/Register';

import './App.css'; // Import your CSS file

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register"  component={Register} />
          <Route path="/chat" component={ChatUI} />
          <Route path="/document" component={Document} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;