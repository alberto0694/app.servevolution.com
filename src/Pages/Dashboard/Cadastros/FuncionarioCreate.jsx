import axios from 'axios';
import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

import history from '../../../Componentes/History';

class FuncionarioCreate extends Component {

    constructor(props) {

        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.setState({
            funcionario: {
                pessoa: {
                    apelido: null,
                    contatoImediato: null
                }
            }
        });        
    }

    componentDidMount() {


        if (this.props.funcionario_id != null) {



        } else {

            axios.get(`api/funcionario/get/${this.props.funcionario_id}`)
                .then((response) => {
                    console.log('funcionariocreate', response);
                    this.setState(response.data);
                })
                .catch((error) => {
                    console.log('error', error);
                });
        }


    }

    salvarFuncionario() {

        axios.post('api/funcionario/createOrUpdate',
            {
                ...this.props

            })
            .then((response) => {
                console.log('funcionariocreate', response);
            })
            .catch((error) => {
                console.log('error', error);
            });

    }

    cancelar() {
        history.back();
    }



    render() {
        return (
            <>
                <div className="row">
                    <div className="col-xl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Dados do Funcionário</h4>
                            </div>
                            <div className="card-body">
                                <div className="basic-form">
                                    <form>
                                        <div className="mb-3">
                                            <input type="text" className="form-control input-default " placeholder="Nome do Funcionário" />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control input-default" placeholder="Contato Imediato" />
                                        </div>

                                        <button type="button" onClick={() => this.salvarFuncionario()} className="btn btn-primary">Salvar</button>
                                        <button type="button" onClick={() => this.cancelar()} className="btn btn-default">Cancelar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default FuncionarioCreate;