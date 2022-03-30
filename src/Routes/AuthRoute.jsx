import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export default class AuthRoute extends Component {

    isAuthenticated() {
        let usuarioCache = localStorage.getItem("usuarioCache");
        return usuarioCache != null && usuarioCache != 'undefined';
    }

    render() {

        return (
            <div>
                {this.isAuthenticated() ? this.props.children : <Navigate to="/login" />}
            </div>
        );
    }
}
