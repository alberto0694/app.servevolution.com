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
    Selection
} from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
import Loading from '../../../../../Componentes/Loading';

export default function Index() {

    const swal = withReactContent(Swal);
    const [ordemServico, setOrdemServico] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const dataGridRef = useRef();

    useEffect(() => {
        getListOrdemServico();
    }, []);

    const getListOrdemServico = () => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {

            axios.post(`/api/titulo/ordem-servicos`)
                .then((response) => {

                    setShowLoader(false);
                    setOrdemServico(response.data);

                })
                .catch((error) => {
                    reject(error);
                    NotificationManager.error(JSON.stringify(error), 'Título Financeiro');
                });
        });

    };

    const gerarTitulo = () => {

        
        swal.fire({
            title: 'Gerar Tìtulo Financeiro',
            text: `Deseja realmente retirar gerar esse título financeiro?`,
            icon: 'question',
            confirmButtonText: 'Sim, gerar',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
            .then((response) => {

                if (response.isConfirmed) {

                    const selectedData = dataGridRef.current.instance.getSelectedRowsData();
                    setShowLoader(true);
                    axios.post(`/api/titulo/ordem-servicos/gerar`, selectedData)
                        .then((response) => {

                            getListOrdemServico();
                            NotificationManager.success('Título gerado com sucesso.', 'Título Financeiro');

                        })
                        .catch((error) => {
                            setShowLoader(false);
                            NotificationManager.error(JSON.stringify(error), 'Título Financeiro');
                        });

                }

            });     
    }

    if(showLoader){
        return <Loading/>
    }

    return (
        <>
            <div className="d-flex justify-start">
                <Button
                    text="Gerar titulo"
                    type="normal"
                    icon='fas fa-plus'
                    stylingMode="contained"
                    onClick={gerarTitulo}
                />
            </div>        


            <DataGrid
                dataSource={ordemServico}
                allowColumnReordering={true}
                rowAlternationEnabled={true}
                showBorders={true}
                hoverStateEnabled={true}
                ref={dataGridRef}
            >
                <GroupPanel visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} />
                <Grouping autoExpandAll={false} />
                <Selection
                    mode="multiple"
                    selectAllMode='allPages'
                    showCheckBoxesMode='always'
                />
                <Column
                    dataType="string"
                    caption="Cliente"
                    dataField='cliente.pessoa.normalized_name'
                />
                <Column
                    dataType="string"
                    caption="Serviço"
                    dataField="servico.descricao"
                />
                <Column
                    dataType="date"
                    caption="Dia"
                    width={110}
                    format="dd/MM/yyyy"
                    dataField="data"
                />
                <Column
                    dataType="datetime"
                    caption="Hora"
                    width={80}
                    format="HH:mm"
                    dataField="hora"
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
                                    {/* <Link to={`/app/ordem-servico-create`} className="m-1"> */}
                                        <Button
                                            text=""
                                            type="normal"
                                            icon='fas fa-plus'
                                            stylingMode="contained"
                                        />
                                    {/* </Link> */}
                                </div>
                            </>
                        )
                    }}
                />

                <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                <Paging defaultPageSize={10} />
            </DataGrid>
        </>
    )
}
