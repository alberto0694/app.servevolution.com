import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';
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

			})
			.catch((error) => {
				NotificationManager.error(JSON.stringify(error), 'Cliente');
			});

	}, []);


	const showModalExcluir = function (e, cliente) {

		if (cliente == null) {
			NotificationManager.warning('Nenhum registro encontrado', 'Cliente');
			return;
		}

		swal.fire({
			title: 'Exclusão de Cliente',
			text: 'Deseja realmente excluir este registro?',
			icon: 'question',
			confirmButtonText: 'Sim',
			showCancelButton: true,
			cancelButtonText: 'Não, cancelar',
		})
			.then((response) => {

				if (response.isConfirmed) {
					setShowLoader(true);
					axios.get(`api/clientes/delete/${cliente.id}`)
						.then((response) => {
							setClientes(response.data);
							setShowLoader(false);
							NotificationManager.success('Cliente excluído com sucesso!', 'Cliente');
						})
						.catch((error) => {
							setShowLoader(false);
							NotificationManager.error(JSON.stringify(error), 'Cliente');
						});

				}
			});

	}

    const renderFotoCell = (cellData) => {
        return (
            <img className="rounded-circle" width="35" src={ cellData.value || "images/contacts/user.jpg" } alt=""/>
        );
    }	

	const renderClientes = function () {

		return (
			<>
				<DataGrid
					dataSource={clientes}
					allowColumnReordering={true}
					rowAlternationEnabled={true}
					showBorders={true}
				>
					<GroupPanel visible={true} />
					<SearchPanel visible={true} highlightCaseSensitive={true} />
					<Grouping autoExpandAll={false} />

					<Column
						dataField={"pessoa.foto"}
						cellRender={renderFotoCell}
						alignment="center"
						width={90}
						caption=""
					/>
					<Column
						caption="Nome"
						dataField={ "pessoa.normalized_name" }
					/>
					<Column
						dataField="pessoa.contatoImediato"
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
										<Link to={`/app/cliente-create/${data.id}`}>
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

	const renderPage = function () {

		if (showLoader) {

			return <Loading />

		} else {

			return (
				<>
					<div className="project-nav justify-content-end">
						<div className="d-flex justify-end">
							<Link to={`/app/cliente-create`} className="m-1">
								<Button
									text="Novo Cliente"
									type="normal"
									icon='fas fa-plus'
									stylingMode="contained"
								/>
							</Link>
						</div>
					</div>

					<div className="tab-content">
						<div className="tab-pane fade show active" id="navpills-1" >
							<div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">

								{renderClientes()}

							</div>
						</div>
					</div>
				</>
			);
		}
	}

	return (
		<>
			<Content titulo="Lista de Clientes">
				{renderPage()}
			</Content>
		</>
	)
}
