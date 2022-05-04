import React, { Component } from 'react';
import axios from 'axios';

export default class Header extends Component {

    userCache = null;

    constructor(props) {

        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);

    }

    doLogout() {

        axios.post('/api/auth/logout')
            .then((response) => {

                localStorage.removeItem("usuarioCache");
                window.location.pathname = '/';
            })
            .catch((error) => {

                this.setState({ isLoging: false });
            });

    }

    componentDidMount() {

        let user = localStorage.getItem("usuarioCache");

        if(user == null){
            localStorage.removeItem("usuarioCache");
            window.location.pathname = '/';
        }

        this.userCache = JSON.parse(user);
        this.setState({ menu: this.userCache.menu });
    }

    render() {
        return (
            <div className="header">
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">
                            <div className="header-left">
                                <div className="input-group search-area right d-lg-inline-flex d-none">
                                    <input type="text" className="form-control" placeholder="Pesquise aqui..." />
                                    <span className="input-group-text"><a href="javascript:void(0)">
                                        <i className="flaticon-381-search-2"></i></a></span>
                                </div>
                            </div>
                            <ul className="navbar-nav header-right main-notification">
                                <li className="nav-item dropdown notification_dropdown">
                                    <a className="nav-link bell dz-fullscreen" href="javascript:void(0)">
                                        <svg id="icon-full" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"
                                            fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
                                            <path
                                                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                                                style={{ strokeDasharray: "37, 57", strokeDashoffset: 0 }}></path>
                                        </svg>
                                        <svg id="icon-minimize" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minimize">
                                            <path
                                                d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
                                                style={{ strokeDasharray: "37, 57", strokeDashoffset: 0 }}></path>
                                        </svg>
                                    </a>
                                </li>
                                <li className="nav-item dropdown notification_dropdown">
                                    <a className="nav-link  ai-icon" href="javascript:void(0)" role="button" data-bs-toggle="dropdown">
                                        <svg className="bell-icon" width="24" height="24" viewBox="0 0 28 28" fill="none"
                                        >
                                            <path
                                                d="M22.75 15.8385V13.0463C22.7471 10.8855 21.9385 8.80353 20.4821 7.20735C19.0258 5.61116 17.0264 4.61555 14.875 4.41516V2.625C14.875 2.39294 14.7828 2.17038 14.6187 2.00628C14.4546 1.84219 14.2321 1.75 14 1.75C13.7679 1.75 13.5454 1.84219 13.3813 2.00628C13.2172 2.17038 13.125 2.39294 13.125 2.625V4.41534C10.9736 4.61572 8.97429 5.61131 7.51794 7.20746C6.06159 8.80361 5.25291 10.8855 5.25 13.0463V15.8383C4.26257 16.0412 3.37529 16.5784 2.73774 17.3593C2.10019 18.1401 1.75134 19.1169 1.75 20.125C1.75076 20.821 2.02757 21.4882 2.51969 21.9803C3.01181 22.4724 3.67904 22.7492 4.375 22.75H9.71346C9.91521 23.738 10.452 24.6259 11.2331 25.2636C12.0142 25.9013 12.9916 26.2497 14 26.2497C15.0084 26.2497 15.9858 25.9013 16.7669 25.2636C17.548 24.6259 18.0848 23.738 18.2865 22.75H23.625C24.321 22.7492 24.9882 22.4724 25.4803 21.9803C25.9724 21.4882 26.2492 20.821 26.25 20.125C26.2486 19.117 25.8998 18.1402 25.2622 17.3594C24.6247 16.5786 23.7374 16.0414 22.75 15.8385ZM7 13.0463C7.00232 11.2113 7.73226 9.45223 9.02974 8.15474C10.3272 6.85726 12.0863 6.12732 13.9212 6.125H14.0788C15.9137 6.12732 17.6728 6.85726 18.9703 8.15474C20.2677 9.45223 20.9977 11.2113 21 13.0463V15.75H7V13.0463ZM14 24.5C13.4589 24.4983 12.9316 24.3292 12.4905 24.0159C12.0493 23.7026 11.716 23.2604 11.5363 22.75H16.4637C16.284 23.2604 15.9507 23.7026 15.5095 24.0159C15.0684 24.3292 14.5411 24.4983 14 24.5ZM23.625 21H4.375C4.14298 20.9999 3.9205 20.9076 3.75644 20.7436C3.59237 20.5795 3.50014 20.357 3.5 20.125C3.50076 19.429 3.77757 18.7618 4.26969 18.2697C4.76181 17.7776 5.42904 17.5008 6.125 17.5H21.875C22.571 17.5008 23.2382 17.7776 23.7303 18.2697C24.2224 18.7618 24.4992 19.429 24.5 20.125C24.4999 20.357 24.4076 20.5795 24.2436 20.7436C24.0795 20.9076 23.857 20.9999 23.625 21Z"
                                                fill="#EB8153" />
                                        </svg>
                                        <div className="pulse-css"></div>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <div id="dlab_W_Notification1" className="widget-media dz-scroll p-3 height380">
                                            <ul className="timeline">
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media me-2">
                                                            <img alt="image" width="50" src="images/avatar/1.jpg" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">Dr sultads Send you Photo</h6>
                                                            <small className="d-block">29 July 2020 - 02:26 PM</small>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media me-2 media-info">
                                                            KG
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">Resport created successfully</h6>
                                                            <small className="d-block">29 July 2020 - 02:26 PM</small>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media me-2 media-success">
                                                            <i className="fa fa-home"></i>
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">Reminder : Treatment Time!</h6>
                                                            <small className="d-block">29 July 2020 - 02:26 PM</small>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media me-2">
                                                            <img alt="image" width="50" src="images/avatar/1.jpg" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">Dr sultads Send you Photo</h6>
                                                            <small className="d-block">29 July 2020 - 02:26 PM</small>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media me-2 media-danger">
                                                            KG
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">Resport created successfully</h6>
                                                            <small className="d-block">29 July 2020 - 02:26 PM</small>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media me-2 media-primary">
                                                            <i className="fa fa-home"></i>
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">Reminder : Treatment Time!</h6>
                                                            <small className="d-block">29 July 2020 - 02:26 PM</small>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <a className="all-notification" href="javascript:void(0)">See all notifications <i
                                            className="ti-arrow-right"></i></a>
                                    </div>
                                </li>                                
                                <li className="nav-item dropdown header-profile">
                                    <a className="nav-link" href="javascript:void(0)" role="button" data-bs-toggle="dropdown">
                                        <img src="images/profile/pic1.jpg" width="20" alt="" />
                                        <div className="header-info">
                                            <span>{ this.userCache?.usuario.name }</span>
                                            <small>{ this.userCache?.usuario.email }</small>
                                        </div>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a href="./app-profile.html" className="dropdown-item ai-icon">
                                            <svg id="icon-user1" className="text-primary" width="18" height="18"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            <span className="ms-2">Profile </span>
                                        </a>
                                        <a href="./email-inbox.html" className="dropdown-item ai-icon">
                                            <svg id="icon-inbox" className="text-success" width="18" height="18"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                            <span className="ms-2">Inbox </span>
                                        </a>
                                        <a onClick={() => { this.doLogout(); }} className="dropdown-item ai-icon">
                                            <svg id="icon-logout" className="text-danger" width="18" height="18"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                <line x1="21" y1="12" x2="9" y2="12"></line>
                                            </svg>
                                            <span className="ms-2">Sair </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        )
    }
}
