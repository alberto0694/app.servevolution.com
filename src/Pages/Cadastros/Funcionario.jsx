
import React, { Component } from 'react';
import UserCard from '../../Componentes/UserCard';

class Funcionario extends Component {

    setConfigCharts(){
        window.$("#sparkline8").sparkline([79, 72, 29, 6, 52, 32, 73, 40, 14, 75, 77, 39, 9, 15, 10], {
            type: "line",
            //width: "100%",
            width: 300,
            height: "50",
            lineColor: "#EB8153",
            fillColor: "rgba(235, 129, 83, .5)",
            minSpotColor: "#EB8153",
            maxSpotColor: "#EB8153",
            highlightLineColor: "#EB8153",
            highlightSpotColor: "#EB8153",
            
        });
    }

    constructor(props) {
        super(props);

        
        
        this.setConfigCharts = this.setConfigCharts.bind(this);
     }

    componentDidMount(){


        
            window.addEventListener('load', this.setConfigCharts);

           console.log('passei aqui');



    }


    render() {

        let elementos = [];

        for (let index = 0; index < 10; index++) {
            elementos.push(<UserCard key={index} />);
        }

        return (
            <>
					<div className="col-xl-3 col-xxl-4 col-sm-6">
                        <div className="card">
                            <div className="card-header" onClick={ this.setConfigCharts }>
								<h4 className="card-title">Site Traffic</h4>
							</div>
							<div className="card-body">
                                <div className="ico-sparkline">
									<div id="sparkline8"></div>
								</div>                              
                            </div>
                        </div>
					</div>

                <div className="project-nav">
                    <div className="card-action card-tabs  me-auto mb-md-0 mb-3">
                        <ul className="nav nav-tabs style-2">
                            <li className="nav-item">
                                <a href="#navpills-1" className="nav-link active" data-bs-toggle="tab" aria-expanded="false">Todos <span className="badge badge-primary shadow-primary">154</span></a>
                            </li>
                            <li className="nav-item">
                                <a href="#navpills-2" className="nav-link" data-bs-toggle="tab" aria-expanded="false">Pendentes <span className="badge shadow-warning  badge-warning">6</span></a>
                            </li>
                        </ul>
                    </div>


                    <div className="d-flex align-items-center">
                        <button data-bs-toggle="modal" data-bs-target="#addContactModal" id="btn-add-contact" className="btn btn-primary text-white">Novo Funcionário</button>
                    </div>
                </div>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="navpills-1" >
                        <div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">
                            <div className="items items-header-section">
                            </div>
                            {
                                elementos
                            }
                        </div>
                    </div>
                </div>

                { this.showNovoFuncionario() }

            </>
        );
    }

    showNovoFuncionario() {
        return (
            <>
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