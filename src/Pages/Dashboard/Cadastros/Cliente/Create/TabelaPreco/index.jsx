import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import TextArea from 'devextreme-react/text-area';
import DataGrid, {
	Column,
	Grouping,
	GroupPanel,
	Pager,
	Paging,
	SearchPanel,
} from 'devextreme-react/data-grid';
import Popup from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';

import Loading from '../../../../../../Componentes/Loading';
import ValorServico from '../../../../../../Models/ValorServico';



export default function Index({ cliente, setCliente, tipoServicos, unidadesMedidas }) {

	let swal = withReactContent(Swal);
	const [showModalServico, setShowModalServico] = useState(false);
	const [showLoader, setShowLoader] = useState(false);
	const [valorServico, setValorServico] = useState(null);

	useEffect(() => {

		console.log('valorServico', valorServico);
		if(!valorServico) return;

		if(!valorServico?.cliente_id){
			NotificationManager.warning('Salve primeiro este cliente para poder adicionar um valor de serviço.', 'Tabela de Preço');
			return;
		}		
		setShowModalServico(true);

	}, [valorServico]);

	const adicionarValorServico = () => {
		setValorServico({ ...new ValorServico(), cliente_id: cliente.id });
	}

	const editarValorServico = (data) => {
		setValorServico({ ...data });	
	}

	const salvarValorServico = () => {
		
		setShowLoader(true);
		axios.post('api/clientes/valor-servico/createOrUpdate', valorServico)
			.then((response) => {
				setShowModalServico(false);
				setShowLoader(false);
				setCliente({ ...cliente, valores_servicos: response.data });
				NotificationManager.success('Valor do serviço salvo com sucesso.', 'Tabela de Preço');
			})
			.catch((error) => {
				setShowLoader(false);
				NotificationManager.error(JSON.stringify(error), 'Tabela de Preço');
			});
	}

	const renderModalSevico = () => {

		return (
			<>
				<Popup
					width={780}
					height={300}
					showTitle={true}
					title={'Adicionar serviço'}
					dragEnabled={false}
					closeOnOutsideClick={true}
					visible={showModalServico}
					onHiding={() => {
						setShowModalServico(false)
					}}
					contentRender={() => {

						return (
							<>
								<form>
									<div className="row">

										<div className="form-group col-5">
											<label>Tipo de Serviço</label>
											<SelectBox
												dataSource={tipoServicos}
												displayExpr='descricao'
												searchEnabled={true}
												searchMode='contains'
												searchExpr={'descricao'}
												searchTimeout={200}
												minSearchLength={3}
												showDataBeforeSearch={true}
												valueExpr='id'
												value={valorServico.tipo_servico_id}
												onValueChanged={(data) => {
													setValorServico({ ...valorServico, tipo_servico_id: data.value });
												}}
											/>
										</div>

										<div className="form-group col-3">
											<label>Valor</label>
											<NumberBox
												className="form-control"
												format="R$ 0#.###.##,##"
												value={valorServico.valor}												
												onValueChanged={(data) => {
													setValorServico({ ...valorServico, valor: data.value });
												}}
											/>
										</div>

										<div className="form-group col-4">
											<label>Como será cobrado</label>
											<SelectBox
												dataSource={unidadesMedidas}
												displayExpr='descricao'
												searchEnabled={true}
												searchMode='contains'
												searchExpr={'descricao'}
												searchTimeout={200}
												minSearchLength={3}
												showDataBeforeSearch={true}
												valueExpr='id'
												value={valorServico.unidade_medida_id}
												onValueChanged={(data) => {
													setValorServico({ ...valorServico, unidade_medida_id: data.value });
												}}
											/>
										</div>

										<div className="form-group col-12 mt-3">
											<div className="d-flex justify-end">
												<Button
													text="Cancelar"
													type="normal"
													icon='fas fa-arrow-left'
													stylingMode="contained"
													onClick={() => setShowModalServico(false)}
												/>

												<Button
													text="Salvar"
													type="success"
													className="ml-1"
													icon='fas fa-save'
													stylingMode="contained"
													onClick={() => salvarValorServico()}
												/>
											</div>

										</div>

									</div>
								</form>
							</>)
					}}
				/>

			</>
		)
	}

	const renderPage = () => {
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


				}

			});
	}

	if(showLoader){
		return <Loading/>
	}

	return (
		<>
			<div className="mt-4">
				<div className="d-flex justify-start">
					<Button
						text="Adicionar serviço"
						type="normal"
						icon='fas fa-plus'
						stylingMode="contained"
						onClick={adicionarValorServico}
					/>
				</div>

				<DataGrid
					dataSource={cliente.valores_servicos}
					allowColumnReordering={true}
					rowAlternationEnabled={true}
					showBorders={true}
				>
					<GroupPanel visible={true} />
					<SearchPanel visible={true} highlightCaseSensitive={true} />
					<Grouping autoExpandAll={false} />

					<Column
						caption="Tipo de Serviço"
						dataField="tipo_servico.descricao"
						dataType="string"
						defaultSortOrder="asc"
					/>

					<Column
						caption="Valor"
						dataField="valor"
						dataType="number"
						format={{ 
							style: 'currency', 
							precision: 2, 
							currency: 'BRL'
						}}
						customizeText={(data) => {
							return data.valueText.replace("$", "$ ");
						}}
					/>

					<Column
						caption="Cobrança relizada por"
						dataField="unidade_medida.descricao"
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
										<Button
											type="normal"
											icon='fas fa-pencil-alt'
											onClick={() => editarValorServico(data)}
										/>
										<Button
											className='ml-1'
											type="normal"
											icon='fas fa-trash'
											onClick={(e) => 0}
										/>
									</div>
								</>
							)
						}}
					/>

					<Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={false} />
					<Paging defaultPageSize={10} />
				</DataGrid>

			</div>
			{renderModalSevico()}
		</>
	)
}
