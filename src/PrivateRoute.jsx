import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export default class PrivateRoute extends Component {

    isAuthenticated(){
        return localStorage.getItem("usuarioCache") != null;
    }



    render() {

        return (
            <div>
                { this.isAuthenticated() ? this.props.children : <Navigate to="/login" /> }
            </div>
        );
    }
}

// export default function PrivateRoute({ children }) {
//     const auth = false;
//     return auth ? children : <Navigate to="/login" />;
//   }