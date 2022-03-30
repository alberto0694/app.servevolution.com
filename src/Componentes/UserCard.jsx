import { Item } from 'devextreme-react/validation-summary';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserCard extends Component {


    constructor(props) {

        super(props);
        this.state = { ...props };

    }


    renderServicos() {

        if(this.state.funcionario?.tipoServicos == null) return;

        return this.state.funcionario.tipoServicos.map((ts) => {
            return <span style={{ minWidth: "100px", float: "left" }} className="fs-14 mb-3 user-work">{ ts.descricao }&nbsp;</span>
        })

    }


    render() {
        return (
            <>
                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 items">
                    <div className="card contact-bx item-content">
                        <div className="card-header border-0">
                            <div className="action-dropdown">
                                <div className="dropdown">
                                    <a href="javascript:void(0)" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={ this.state.user.foto || '' } alt="" />
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a className="dropdown-item edit" href="javascript:void(0)">Editar</a>
                                        <a className="dropdown-item delete" href="javascript:void(0)">Excluir</a>
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
                                <h6 className="fs-20 font-w500 my-1">
                                    <Link to="`/app/cards`" className="text-black user-name" data-name="Angela Moss">{ this.state.user.name || this.state.user.name }</Link>
                                </h6>                                
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default UserCard;