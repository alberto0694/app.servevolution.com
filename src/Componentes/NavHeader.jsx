import React, { Component } from 'react'

export default class NavHeader extends Component {
    render() {
        return (
            <div className="nav-header">
                <a href="index.html" className="brand-logo">
                    <h4>ServEvolution</h4>
                </a>

                <div className="nav-control">
                    <div className="hamburger">
                        <span className="line"></span><span className="line"></span><span className="line"></span>
                    </div>
                </div>
            </div>
        )
    }
}
