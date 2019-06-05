import React from 'react';

class UserList extends React.Component {
    render(){
    return(
    <div>
        {this.props.userProps.map(user => 
        <div key={user.id}>
            <h1>{user.name}</h1>
            <h3>{user.id}</h3>
        </div>)}
    </div>      
    )}
}

export default UserList;