import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import {NotificationManager} from 'react-notifications';
import { Button } from 'devextreme-react/button';
import DataGrid, {
	Column,
	Grouping,
	GroupPanel,
	Pager,
	Paging,
	SearchPanel,
} from 'devextreme-react/data-grid';

import Content from '../../../../Componentes/Content';
import Loading from '../../../../Componentes/Loading';
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
				
			})
			.catch((error) => {
				NotificationManager.error(JSON.stringify(error), 'Tipo de Serviço');
			});

	}, []);

	const showModalExcluir = function(e, tipo){

        if (tipo == null){ 
            NotificationManager.warning('Registro não encontrado', 'Tipo de Serviço');
            return;
        }

        swal.fire({
            title: 'Exclusão de tipo de serviço',
            text: 'Deseja realmente excluir este registro?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
        .then((response) => {
            
            if(response.isConfirmed){                
            
				setShowLoader(true);
                axios.get(`api/tipo-servicos/delete/${tipo.id}`)
                    .then((response) => { 
						setShowLoader(false);
						setTipoServicos(response.data);
                        NotificationManager.success('Registro excluído com sucesso.', 'Tipo de Serviço');
                    })
                    .catch((error) => {
						setShowLoader(true);
                        NotificationManager.error(JSON.stringify(error), 'Tipo de Serviço');
                    });

            }
        });

    }

	const renderTipoServicos = function(){

		return (
			<>
				<DataGrid
					dataSource={tipoServicos}
					allowColumnReordering={true}
					rowAlternationEnabled={true}
					showBorders={true}
				>
					<GroupPanel visible={true} />
					<SearchPanel visible={true} highlightCaseSensitive={true} />
					<Grouping autoExpandAll={false} />

					<Column
						dataField="descricao"
						dataType="string"
					/>
					<Column
						alignment="center"
						caption="Ações"
						width={120}
						cellRender={(cellData) => {
							const { data } = cellData;
							return (
								<>
									<div className="d-flex justify-center">
										<Link to={`/app/tipo-servicos-create/${data.id}`}>
											<Button
												type="normal"
												icon='fas fa-pencil-alt'
											/>
										</Link>
										<Button
											className='ml-1'
											type="normal"
											icon='fas fa-trash'
											onClick={(e) => showModalExcluir(e, data)}
										/>
									</div>
								</>
							)
						}}
					/>

					<Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={false} />
					<Paging defaultPageSize={10} />
				</DataGrid>

			</>
		);
	}

	const renderPage = function (){

        if(showLoader){
            return <Loading />
		}

		return(
			<>
				<div className="project-nav justify-content-end">
					<div className="d-flex align-items-center">               
						<Link to={`/app/tipo-servicos-create`}>
							<Button
								className='ml-1'
								text='Novo Tipo de Serviço'
								type="normal"
								icon='fas fa-plus'
							/>
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

	return(
		<>		
			<Content titulo="Lista de Tipos de serviços">
				{ renderPage() }
			</Content>
		</>		
	)
	

}
