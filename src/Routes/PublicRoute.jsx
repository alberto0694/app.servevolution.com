import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import LoginCliente from "../Pages/LoginCliente";

class PublicRoute extends Component {
    render() {
        return (
            <div>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/portal-cliente" element={<LoginCliente />} />
                </Routes>
            </div>
        );
    }
}

export default PublicRoute;