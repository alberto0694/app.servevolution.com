import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Menu extends Component {

    constructor(props) {

        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);

    }

    componentDidMount() {

        let user = JSON.parse(localStorage.getItem("usuarioCache"));
        this.setState({ menu: user.menu });
    }

    renderMenu(){

        // return this.state.menu?.map((item) => {

        // });

    }


    render() {
        return (
            <>
                <div className="deznav">
                    <div className="deznav-scroll">
                        <div className="main-profile">
                            <div className="image-bx">
                                <img src="images/Untitled-1.jpg" alt="" />
                                <a href="javascript:void(0);"><i className="fa fa-cog" aria-hidden="true"></i></a>
                            </div>
                            <h5 className="name"><span className="font-w400">Hello,</span> Marquez</h5>
                            <p className="email">marquezzzz@mail.com</p>
                        </div>
                        <ul className="metismenu" id="menu">

                            <li className="nav-label first">Área do Usuário</li>

                            <li>
                                <a className="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
                                    <i className="flaticon-077-menu-1"></i>
                                    <span className="nav-text">Cadastros</span>
                                </a>
                                <ul aria-expanded="false">

                                    <li>
                                        <Link to="/app/funcionarios">Funcionários</Link>
                                    </li>

                                    <li>
                                        <Link to="/app/funcionario-create">Tipos de Serviços</Link>
                                    </li>

                                    <li>
                                        <Link to="/app/tipos-servicos">Tipos de Serviços</Link>
                                    </li>

                                </ul>
                            </li>

                        </ul>
                    </div>
                </div>

            </>
        );
    }
}

export default Menu;