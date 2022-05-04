import $ from 'jquery'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "datatables.net-dt/js/dataTables.dataTables";
import withReactContent from 'sweetalert2-react-content';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import Content from '../../../../Componentes/Content';
import TipoServicoModel from '../../../../Models/TipoServico';

export default function TipoServicoList() {

	let [tipoServicos, setTipoServicos] = useState(new TipoServicoModel());
	let [showLoader, setShowLoader] = useState(true);
	let swal = withReactContent(Swal);

	useEffect(() => {

		axios.get('/api/tipo-servicos/list')
			.then((response) => {
				
				setTipoServicos(response.data);
				setShowLoader(false);
				var table = $('#tabela-tipo-servicos').DataTable(
					{
					language: {
						paginate: {
							next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
							previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
						}
					}
				});
		
				$('#tabela-tipo-servicos tbody').on('click', 'tr', function () {
					var data = table.row( this ).data();
				}); 				
			})
			.catch((error) => {
				NotificationManager.error(JSON.stringify(error), 'Erro!');
			});

	}, []);

	useEffect(() => {
		var table = $('#tabela-tipo-servicos').DataTable(
			{
			language: {
				paginate: {
					next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
					previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
				}
			}
		});

		$('#tabela-tipo-servicos tbody').on('click', 'tr', function () {
			var data = table.row( this ).data();
		}); 

		
	}, [tipoServicos]);


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
            
                axios.get(`api/tipo-servicos/delete/${tipo.id}`)
                    .then((response) => { 
						setTipoServicos(response.data);
                        NotificationManager.success('Tipo de serviço excluído', 'Excluído com sucesso!');
                    })
                    .catch((error) => {
                        NotificationManager.error(JSON.stringify(error), 'Erro ao excluir!');
                    });

            }
        });

    }

	const renderTipoServicos = function(){

		if (tipoServicos != null && tipoServicos.length > 0) {

			return (
				<div className="table-responsive">
					<table id="tabela-tipo-servicos" className="display" style={{minWidth: 845}}>
						<thead>
							<tr>
								<th>Tipo de serviço</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
						{
							tipoServicos.map((tipo, index) => {
								return (
									<tr key={index.toString()}>
										<td>{ tipo.descricao }</td>
										<td>
											<div className="d-flex">
												<Link to={`/app/tipo-servicos-create/${tipo.id}`} className="btn btn-primary shadow btn-xs sharp me-1"><i className="fas fa-pencil-alt"></i></Link>
												<button onClick={ (e) => showModalExcluir(e, tipo) } className="btn btn-danger shadow btn-xs sharp"><i className="fa fa-trash"></i></button>
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
						<strong>Aviso!</strong> Não foi encontrado nenhum tipo de serviço.
						{/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="btn-close"></button> */}
					</div>
				</>
			)
		}

	}

	const renderPage = function (){

		console.log('showLoader', showLoader);

        if(showLoader){

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
                            <Link to={`/app/tipo-servicos-create`} className="btn btn-primary btn-sm text-white m-1">
                                <i className="fas fa-plus"></i>&nbsp;Novo Tipo de Serviço
                            </Link>
                        </div>
                    </div>
    
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navpills-1" >
                            <div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">
                                <div className="items items-header-section">
                                </div>
                                
                                { renderTipoServicos() }
    
                            </div>
                        </div>
                    </div>
    
                </>
            );
        }
 
    }

	return(

		<>
		
			<Content titulo="Lista de Tipos de serviços">
				{ renderPage() }
			</Content>

			<NotificationContainer />
		</>

		
	)
	

}
