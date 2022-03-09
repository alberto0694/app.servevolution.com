import React, { Component } from 'react';
import axios from 'axios';
import UserCard from '../../../Componentes/UserCard';
import { Link } from 'react-router-dom';

class Funcionario extends Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {

        axios.get('/api/funcionario/list')
            .then((response) => {

                this.setState({ funcionarios: response.data });

            })
            .catch((error) => {

            });
    }

    renderFuncionarios() {

        if (this.state.funcionarios != null && this.state.funcionarios.length > 0) {
            
            return this.state.funcionarios.map((item, index) => {
                return <UserCard key={index} user={item} />
            });
        }
        else {
            
            return <h1>nenhum funcionario encontrado</h1>
        }

    }

    render() {

        return (
            <>
                <div className="project-nav">
                    <div className="d-flex align-items-center">
                        <button data-bs-toggle="modal" data-bs-target="#addContactModal" id="btn-add-contact" className="btn btn-primary text-white">Cadastro Rápido</button>
                        <Link to={`/app/funcionario-create`} className="btn btn-primary text-white">Novo Funcionário</Link>
                    </div>
                </div>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="navpills-1" >
                        <div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">
                            <div className="items items-header-section">
                            </div>
                            
                            { this.renderFuncionarios() }

                        </div>
                    </div>
                </div>

                <div className="modal fade" id="addContactModal" tabIndex="-1" role="dialog" aria-labelledby="addContactModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title fs-20">Novo Funcionário</h4>
                                <button type="button" className="close" data-bs-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <i className="flaticon-cancel-12 close" data-bs-dismiss="modal"></i>
                                <div className="add-contact-box">
                                    <div className="add-contact-content">
                                        <form id="addContactModalTitle">
                                            <div className="image-placeholder">
                                                <div className="avatar-edit">
                                                    <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" />
                                                    <label htmlFor="imageUpload"></label>
                                                </div>
                                                <div className="avatar-preview">
                                                    <div id="imagePreview" style={{ backgroundImage: "url('images/contacts/user.jpg')" }}>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="text-black font-w500">Nome</label>
                                                <div className="contact-name">
                                                    <input type="text" id="c-name" className="form-control" placeholder="Nome" />
                                                    <span className="validation-text"></span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="text-black font-w500">Contato</label>
                                                <div className="contact-occupation">
                                                    <input type="text" id="c-occupation" className="form-control" placeholder="Telefone, WhatsApp..." />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button id="btn-edit" className="float-left btn btn-primary">Salvar</button>
                                <button className="btn btn-danger" data-bs-dismiss="modal"> <i className="flaticon-delete-1"></i> Descartar</button>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }

}

export default Funcionario;