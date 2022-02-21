import React, { Component } from "react";
import Container from "./Container";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";

class PublicLayout extends Component {
    render() {
        return (
            <div>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/login-teste" element={<Login />} />
                </Routes>
            </div>
        );
    }
}

export default PublicLayout;