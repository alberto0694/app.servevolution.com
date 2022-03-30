import $ from 'jquery'; 
import "datatables.net-dt/js/dataTables.dataTables";

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Content from '../../../../Componentes/Content';
import FuncionarioModel from '../../../../Models/Funcionario.ts';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class FuncionarioList extends Component {

    funcionario = new FuncionarioModel();
    swal = withReactContent(Swal);

    constructor(props) {
        super(props);

        this.state = {
            funcionarios: [],
            funcionario: this.funcionario,
            showLoader: true
        };

        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    getBase64(file) {

        return new Promise((resolve, reject) => {

            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              resolve(reader.result);
            };
            reader.onerror = function (error) {
              reject(error);
            };
            
        });

     }

    onFileChange(e){
        this.getBase64(e.target.files[0])
                .then((result) => {
                    this.funcionario.pessoa.foto = result;
                    this.setState({ funcionario: this.funcionario});
                });
    }

    componentDidMount() {

        axios.get('/api/funcionario/list')
            .then((response) => {

                this.setState({ funcionarios: response.data, showLoader: false }, () => {

                    var table = $('#tabela-funcionarios').DataTable(
                        {
                        language: {
                            paginate: {
                                next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                                previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
                            }
                        }
                    });
    
                    $('#tabela-funcionarios tbody').on('click', 'tr', function () {
                        var data = table.row( this ).data();
                    });            
                    
                });
                        
            })
            .catch((error) => {

                console.log(error);
                NotificationManager.error(JSON.stringify(error), 'Erro!');

            });
    }

    salvarFuncionario() {

        axios.post('api/funcionario/createOrUpdate', this.state.funcionario)
            .then((response) => {
    
                $("#btn-fechar-modal").trigger("click");
    
            })
            .catch((error) => {
                console.log('error', error);
            });
    
    };

    handleChangeInput(e, attr){
        this.funcionario.pessoa[attr] = e.target.value;
        this.setState({ funcionario: this.funcionario });
    };

    showModalExcluir(e, func){

        if (func == null){ 
            this.swal.fire('Funcionário nao encontrado!');
            return;
        }

        this.swal.fire({
            title: 'Exclusão de funcionário!',
            text: 'Deseja realmente excluir este registro?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
        .then((response) => {
            
            if(response.isConfirmed){                
            
                axios.get(`api/funcionario/delete/${func.id}`)
                    .then((response) => {                    
                        NotificationManager.success('Funcinário excluído', 'Excluído com sucesso!');
                    })
                    .catch((error) => {
                        NotificationManager.error(JSON.stringify(error), 'Erro ao excluir!');
                    });

            }
        });

    }

    renderFuncionarios() {

        if (this.state.funcionarios != null && this.state.funcionarios.length > 0) {

            return (
                <div className="table-responsive">
                    <table id="tabela-funcionarios" className="display" style={{minWidth: 845}}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>Contato Imediato</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.funcionarios.map((item, index) => {
                                return (
                                    <tr key={index.toString()}>
                                        <td><img className="rounded-circle" width="35" src={ item.pessoa.foto || "images/contacts/user.jpg" } alt=""/></td>
                                        <td>{ item.pessoa.razao || item.pessoa.apelido }</td>
                                        <td>{ item.pessoa.contatoImediato }</td>
                                        <td>
                                            <div className="d-flex">
                                                <Link to={`/app/funcionario-create/${item.id}`} className="btn btn-primary shadow btn-xs sharp me-1"><i className="fas fa-pencil-alt"></i></Link>
                                                <button onClick={ (e) => this.showModalExcluir(e, item) } className="btn btn-danger shadow btn-xs sharp"><i className="fa fa-trash"></i></button>
                                            </div>												
                                        </td>												
                                    </tr>
                                )
                            })
                        }                                                    
                        </tbody>
                    </table>
                </div>
            );
            
        }
        else {
            
            return (
                <>
                    <div className="alert alert-primary solid alert-dismissible fade show col-6">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <strong>Aviso!</strong> Não foi encontrado nenhum funcionário.
                        {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="btn-close"></button> */}
                    </div>
                </>
            )
        }

    }

    renderModal(){
        return(
            <>
                <div className="modal fade" id="add-funcionario-rapido" tabIndex="-1" role="dialog" aria-labelledby="add-funcionario-rapidoTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title fs-20">Novo Funcionário</h4>
                                <button id="btn-fechar-modal" type="button" className="close" data-bs-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <i className="flaticon-cancel-12 close" data-bs-dismiss="modal"></i>
                                <div className="add-contact-box">
                                    <div className="add-contact-content">
                                        <form id="add-funcionario-rapidoTitle">
                                            <div className="image-placeholder">
                                                <div className="avatar-edit">
                                                    <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" onChange={ (e) => this.onFileChange(e) }/>
                                                    <label htmlFor="imageUpload"></label>
                                                </div>
                                                <div className="avatar-preview">
                                                    <div id="imagePreview" style={{ backgroundImage: this.state.funcionario.pessoa.foto ? `url(${this.state.funcionario.pessoa.foto})` : "url('images/contacts/user.jpg')" }}>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="text-black font-w500">Nome</label>
                                                <div className="contact-name">
                                                    <input type="text" id="c-name" className="form-control" placeholder="Nome ou Apelido" value={this.state.funcionario?.pessoa.apelido} onChange={(e) => this.handleChangeInput(e, 'apelido')}/>
                                                    <span className="validation-text"></span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="text-black font-w500">Contato</label>
                                                <div className="contact-occupation">
                                                    <input type="text" id="c-occupation" className="form-control" placeholder="Telefone, WhatsApp..."  value={this.state.funcionario?.pessoa.contatoImediato} onChange={(e) => this.handleChangeInput(e, 'contatoImediato')}/>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button id="btn-edit" className="float-left btn btn-primary" onClick={() => this.salvarFuncionario() }>Salvar</button>
                                <button className="btn btn-danger" data-bs-dismiss="modal"> <i className="flaticon-delete-1"></i> Descartar</button>
                            </div>
                        </div>
                    </div>
                </div>
            
            </>
        );
    }

    showCadastroRapido(){
        this.setState({ funcionario : new FuncionarioModel() })
        $("#add-funcionario-btn").trigger("click");
    }

    renderPage(){

        if(this.state.showLoader){

            return (
                <>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            );

        } else {

            return(
                <>
                    <div className="project-nav justify-content-end">
                        <div className="d-flex align-items-center">
                            <button id="add-funcionario-btn" data-bs-toggle="modal" data-bs-target="#add-funcionario-rapido" className="btn btn-primary btn-sm text-white d-none">
                                <i className="fas fa-address-book"></i>&nbsp;Botao do modal do funcionario
                            </button>                            
                            <button onClick={() => this.showCadastroRapido() } className="btn btn-primary btn-sm text-white">
                                <i className="fas fa-address-book"></i>&nbsp;Cadastro Rápido
                            </button>
                            <Link to={`/app/funcionario-create`} className="btn btn-primary btn-sm text-white m-1">
                                <i className="fas fa-plus"></i>&nbsp;Novo Funcionário
                            </Link>
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
    
                    { this.renderModal() }
                </>
            );
        }



        
    }

    render() {

        return (
            <>
                <Content titulo="Lista de Funcionários">

                    { this.renderPage() }
                    
                </Content>

                <NotificationContainer />

            </>
        );
    }

}

export default FuncionarioList;