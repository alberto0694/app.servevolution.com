import $ from 'jquery'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "datatables.net-dt/js/dataTables.dataTables";
import withReactContent from 'sweetalert2-react-content';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import Content from '../../../../Componentes/Content';
import ClienteModel from '../../../../Models/Cliente';
import Loading from '../../../../Componentes/Loading';

export default function Cliente() {

	let [clientes, setClientes] = useState(new ClienteModel());
	let [showLoader, setShowLoader] = useState(true);
	let swal = withReactContent(Swal);

	useEffect(() => {

		axios.get('/api/clientes/list')
			.then((response) => {
				
				setClientes(response.data);
				setShowLoader(false);
				var table = $('#tabela-clientes').DataTable(
					{
					language: {
						paginate: {
							next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
							previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
						}
					}
				});
		
				$('#tabela-clientes tbody').on('click', 'tr', function () {
					var data = table.row( this ).data();
				}); 				
			})
			.catch((error) => {
				NotificationManager.error(JSON.stringify(error), 'Erro!');
			});

	}, []);

	useEffect(() => {
		var table = $('#tabela-clientes').DataTable(
			{
			language: {
				paginate: {
					next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
					previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
				}
			}
		});

		$('#tabela-clientes tbody').on('click', 'tr', function () {
			var data = table.row( this ).data();
		}); 

		
	}, [clientes]);


	const showModalExcluir = function(e, tipo){

        if (tipo == null){ 
            swal.fire('tipo de serviço nao encontrado!');
            return;
        }

        swal.fire({
            title: 'Exclusão de tipo!',
            text: 'Deseja realmente excluir este registro?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
        .then((response) => {
            
            if(response.isConfirmed){                
            
                axios.get(`api/clientes/delete/${tipo.id}`)
                    .then((response) => { 
						setClientes(response.data);
                        NotificationManager.success('Tipo de serviço excluído', 'Excluído com sucesso!');
                    })
                    .catch((error) => {
                        NotificationManager.error(JSON.stringify(error), 'Erro ao excluir!');
                    });

            }
        });

    }

	const renderClientes = function(){

		if (clientes != null && clientes.length > 0) {

			return (
				<div className="table-responsive">
					<table id="tabela-clientes" className="display" style={{minWidth: 845}}>
                    <thead>
                            <tr>
                                <th></th>
                                <th>Cliente</th>
                                <th>Contato</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
						<tbody>
						{
							clientes.map((cliente, index) => {
								return (
									<tr key={index.toString()}>
                                        <td><img className="rounded-circle" width="35" src={ cliente.pessoa.foto || "images/contacts/user.jpg" } alt=""/></td>
										<td>{ cliente.pessoa.razao || cliente.pessoa.apelido }</td>
                                        <td>{ cliente.pessoa.contatoImediato }</td>
										<td>
											<div className="d-flex">
												<Link to={`/app/cliente-create/${cliente.id}`} className="btn btn-primary shadow btn-xs sharp me-1"><i className="fas fa-pencil-alt"></i></Link>
												<button onClick={ (e) => showModalExcluir(e, cliente) } className="btn btn-danger shadow btn-xs sharp"><i className="fa fa-trash"></i></button>
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
			
		} else {
			
			return (
				<>
					<div className="alert alert-primary solid alert-dismissible fade show col-6">
						<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
						<strong>Aviso!</strong> Não foi encontrado nenhum cliente.
						{/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="btn-close"></button> */}
					</div>
				</>
			)
		}

	}

	const renderPage = function (){

        if(showLoader){

            return <Loading />

        } else {

            return(
                <>
                    <div className="project-nav justify-content-end">
                        <div className="d-flex align-items-center">               
                            <Link to={`/app/cliente-create`} className="btn btn-primary btn-sm text-white m-1">
                                <i className="fas fa-plus"></i>&nbsp;Novo Cliente
                            </Link>
                        </div>
                    </div>
    
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navpills-1" >
                            <div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">
                                <div className="items items-header-section">
                                </div>
                                
                                { renderClientes() }
    
                            </div>
                        </div>
                    </div>    
                </>
            );
        }       
    }

	return(
		<>		
			<Content titulo="Lista de Funcionários">
				{ renderPage() }
			</Content>

			<NotificationContainer />
		</>
	)
}
