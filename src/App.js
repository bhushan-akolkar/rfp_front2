import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Components/Login/Login';
import ChatUI from './Components/Chat/Chat';
import Register from './Components/Register/Register';
import Document from './Components/Similar_Document/Similar_Document';
import similardocument from './Components/Similar_Document/show_similar_document';
import Checklist from './Components/Checklist/checklist';
import Getchecklist from './Components/Checklist/show_checklist';
import LandingPage from './Components/Landing_Page/Landing_Page';


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
          <Route path="/similardocument" component={similardocument} />
          <Route path="/checklist" component={Checklist} />
          <Route path="/getchecklist" component={Getchecklist} />
          <Route path="/landingpage" component={LandingPage} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;