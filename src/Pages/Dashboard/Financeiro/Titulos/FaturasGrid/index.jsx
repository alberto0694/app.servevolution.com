import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'devextreme-react/button';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
    FilterRow,
    MasterDetail
} from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';
import ParcelaOrdemServicoTabs from './ParcelaOrdemServicoTabs';
import Loading from '../../../../../Componentes/Loading';

export default function Index() {

    const swal = withReactContent(Swal);
    const [titulos, setTitulos] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const dataGridRef = useRef();

    useEffect(() => {
        getListTitulos();
    }, []);

    const getListTitulos = () => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {

            axios.post(`/api/titulo/list`)
                .then((response) => {

                    setShowLoader(false);
                    setTitulos(response.data);
                    resolve(response.data);

                })
                .catch((error) => {
                    reject(error);
                    NotificationManager.error(JSON.stringify(error), 'Título Financeiro');
                });
        });

    };

    const excluirTitulo = function (data) {

		if (data == null) {
			NotificationManager.warning('Nenhum registro encontrado', 'Título Financeiro');
			return;
		}

		swal.fire({
			title: 'Exclusão de Título',
			text: 'Deseja realmente excluir este título financeiro?',
			icon: 'question',
			confirmButtonText: 'Sim',
			showCancelButton: true,
			cancelButtonText: 'Não, cancelar',
		})
			.then((response) => {

				if (response.isConfirmed) {
					setShowLoader(true);
					axios.get(`api/titulo/delete/${data.id}`)
						.then((response) => {
							setTitulos(response.data);
							setShowLoader(false);
							NotificationManager.success('Título financeiro excluído com sucesso!', 'Cliente');
						})
						.catch((error) => {
							setShowLoader(false);
							NotificationManager.error(JSON.stringify(error), 'Títulos');
						});

				}
			});

	}

    if(showLoader){
        return <Loading/>
    }

    return (
        <>

            <DataGrid
                dataSource={titulos}
                allowColumnReordering={true}
                rowAlternationEnabled={true}
                showBorders={true}
                hoverStateEnabled={true}
                ref={dataGridRef}
            >
                <GroupPanel visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} />
                <Grouping autoExpandAll={false} />
                <FilterRow visible={true} applyFilter='auto' />

                <Column
                    dataType="string"
                    caption="Número"
                    dataField='id'
                />
                <Column
                    dataType="number"
                    caption="Valor Nominal"
                    dataField='valor_nominal'
                    format={{ 
                        style: 'currency', 
                        precision: 2, 
                        currency: 'BRL'
                    }}
                    precision={3}
                />
                <Column
                    dataType="number"
                    caption="Valor Atualizado"
                    dataField='valor_atualizado'
                    format={{ 
                        style: 'currency', 
                        precision: 2, 
                        currency: 'BRL'
                    }}
                />
                <Column
                    dataType="number"
                    caption="Valor Baixado"
                    dataField='valor_baixado'
                    format={{ 
                        style: 'currency', 
                        precision: 2, 
                        currency: 'BRL'
                    }}
                />
                <Column
                    dataType="number"
                    caption="Saldo"
                    dataField='saldo'
                    format={{ 
                        style: 'currency', 
                        precision: 2, 
                        currency: 'BRL'
                    }}
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
                                            text=""
                                            type="normal"
                                            icon='fas fa-trash'
                                            stylingMode="contained"
                                            onClick={(e) => excluirTitulo(data)}
                                        />
                                </div>
                            </>
                        )
                    }}
                />
{/* 
                <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                <Paging defaultPageSize={10} /> */}

                <MasterDetail
                    enabled={true}
                    component={(param) => {

                        const { data } = param.data;
                        return <ParcelaOrdemServicoTabs titulo={data}/>
                    }}
                />

            </DataGrid>
        </>
    )
}
