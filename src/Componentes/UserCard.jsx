import React, { Component } from 'react';

class UserCard extends Component {
    render() {
        return (
            <>
                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 items">
                    <div className="card contact-bx item-content">
                        <div className="card-header border-0">
                            <div className="action-dropdown">
                                <div className="dropdown">
                                    <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a className="dropdown-item edit" href="#">Editar</a>
                                        <a className="dropdown-item delete" href="#">Excluir</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body user-profile">
                            <div className="image-bx">
                                <span className="icon-placeholder bgl-success rounded-circle text-success">am</span>
                                <span className="active"></span>
                            </div>
                            <div className="media-body user-meta-info">
                                <h6 className="fs-20 font-w500 my-1"><a href="app-profile.html" className="text-black user-name" data-name="Angela Moss">Angela Moss</a></h6>
                                <span style={{ minWidth:"100px", float: "left" }} className="fs-14 mb-3 user-work">#Chapeiro&nbsp;</span>
                                <span style={{ minWidth:"100px", float: "left" }} className="fs-14 mb-3 user-work">#Limpeza&nbsp;</span>
                                <span style={{ minWidth:"100px", float: "left" }} className="fs-14 mb-3 user-work">#Conserto&nbsp;</span>
                                <span style={{ minWidth:"100px", float: "left" }} className="fs-14 mb-3 user-work">#Motorista&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default UserCard;