import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {

    userCache = null;

    constructor(props) {

        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);

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

    renderMenu(){

        return this.state.menu?.map((item_nivel_1, index_1) => {
                
            if(item_nivel_1.nivel == 1) {

                if(item_nivel_1.rota == null || item_nivel_1.rota == undefined){
                    return( 
                        <li key={index_1.toString()}>
                            <a className="has-arrow ai-icon" href="javascript:void(0)" aria-expanded="false">
                                <i className="flaticon-077-menu-1"></i>
                                <span className="nav-text">{item_nivel_1.titulo}</span>
                            </a>                            
                            <ul aria-expanded="false">
                                {
                                    this.state.menu
                                        .filter(i => i.menu_pai_id == item_nivel_1.id)
                                        .map((item_nivel_2, index_2) => {
                                            return (
                                                <li key={index_2.toString()}>
                                                    <Link to={item_nivel_2.rota}>{ item_nivel_2.titulo }</Link>
                                                </li>
                                            )
                                        })
                                }
                            </ul>
                        </li>
                    );

                } else {

                    return (
                        <li  key={index_1.toString()}>
                            <Link to={item_nivel_1.rota} className="ai-icon">
                                <i className="flaticon-381-settings-2"></i>
                                <span className="nav-text">{item_nivel_1.titulo}</span>
                            </Link>                            
                        </li>
                    );
                }    
            }    
        });

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
                            <h5 className="name"><span className="font-w400">Olá,</span> {this.userCache?.usuario.name}</h5>
                            <p className="email">{this.userCache?.usuario.email}</p>
                        </div>
                        <ul className="metismenu" id="menu">
                                                                               
                            { this.renderMenu() }
                                               
                        </ul>
                    </div>
                </div>

            </>
        );
    }
}

export default Menu;