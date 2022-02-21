import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {



    constructor(props){
        super(props);
        const usuarioCache = localStorage.getItem("usuarioCache");
        if(usuarioCache != null){
            window.location.pathname = 'app';
        }
    }


    doLogin(){


        axios.post('/api/auth/login',{
            "email" : "usuario@teste.com.br",
            "password": "123456"
        }).then((response) => {

            localStorage.setItem("usuarioCache", response)

        }).catch((error) => {


        });


    }





    render() {
        return (
            <>
                <div className="vh-100">
                    <div className="authincation h-100">
                        <div className="container h-100">
                            <div className="row justify-content-center h-100 align-items-center">
                                <div className="col-md-6">
                                    <div className="authincation-content">
                                        <div className="row no-gutters">
                                            <div className="col-xl-12">
                                                <div className="auth-form">
                                                    <div className="text-center mb-3">
                                                        <img src="images/logo-full-black.png" alt="" />
                                                    </div>
                                                    <h4 className="text-center mb-4">Entre com sua conta</h4>
                                                    <form action="index.html">
                                                        <div className="form-group">
                                                            <label className="mb-1"><strong>Usuário</strong></label>
                                                            <input type="email" className="form-control" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="mb-1"><strong>Senha</strong></label>
                                                            <input type="password" className="form-control" />
                                                        </div>
                                                        <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                                            <div className="form-group">
                                                                <div className="custom-control custom-checkbox ms-1">
                                                                    <input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
                                                                    <label className="form-check-label" htmlFor="basic_checkbox_1">Lembrar este acesso</label>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <a href="page-forgot-password.html">Esqueci minha senha.</a>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <button type="button" onClick={() => { this.doLogin(); } } className="btn btn-primary btn-block">Entrar</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

               
            </>
        );
    }
}

export default Login;