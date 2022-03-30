import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavHeader extends Component {
    render() {
        return (
            <div className="nav-header">
                <Link to="/app" className="brand-logo">
                    <div className="text-center brand-title">
                        <img src="images/logo-full-black.png" alt="" />
                    </div>
                </Link>

                <div className="nav-control">
                    <div className="hamburger">
                        <span className="line"></span><span className="line"></span><span className="line"></span>
                    </div>
                </div>
            </div>
        )
    }
}
