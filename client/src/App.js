import React from 'react';
import axios from 'axios';
import {Route, Link} from 'react-router-dom';
import './App.css';
import UserList from './components/UserList';

class App extends React.Component {
  state = {
    users: [],
    message: "",
  }
  componentDidMount(){
    axios.get('http://localhost:4000/api/users')
    .then(res => {
      console.log(res.data)
      this.setState({
        users: res.data,
        message: "User data retrieved"
      })
    })
  }

  render(){
    return (
      <div className="App">
        <h1>WebApi Challenge III</h1>
        <h4>{this.state.message}</h4>
        <Link to="/">Home</Link>
        <Route 
        exact path="/"
        render={
        props => (
          <UserList 
          {...props}
          userProps={this.state.users}
        />)}
        />
      </div>
    )
  }

}
export default App;
