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
    Selection,
    FilterRow
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

    const selecionarParcelas = () => {

        return new Promise((resolve) => {
            swal.fire({
                title: 'Selecione a quantidade de parcelas',
                input: 'select',
                inputOptions: {
                    1: '1 (à vista)',
                    2: '2 vezes',
                    3: '3 vezes',
                    4: '4 vezes',
                    5: '5 vezes',
                    6: '6 vezes',
                    7: '7 vezes'
                },
                showCancelButton: true,
                inputValidator: (value) => {

                    resolve({quantidade_parcelas : value});

                }
            });
        });

    }

    const gerarTitulo = () => {

        const selectedData = dataGridRef.current.instance.getSelectedRowsData();
        if (selectedData.length == 0) {
            NotificationManager.warning('Selecione ao menos uma ordem de serviço.', 'Título Financeiro');
            return;
        }

        selecionarParcelas().then(({ quantidade_parcelas }) => {
            const parcelas_txt = quantidade_parcelas == 1 ? 'à vista' : `em ${quantidade_parcelas} vezes`;
            swal.fire({
                title: 'Gerar Tìtulo Financeiro',
                text: `Deseja realmente gerar esse título financeiro ${parcelas_txt}?`,
                icon: 'question',
                confirmButtonText: 'Sim, gerar',
                showCancelButton: true,
                cancelButtonText: 'Não, cancelar',
            })
            .then((response) => {

                if (response.isConfirmed) {
                    setShowLoader(true);
                    axios.post(`/api/titulo/ordem-servicos/gerar`, { quantidade_parcelas, data: selectedData })
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
                <FilterRow visible={true} applyFilter='auto' />

                <Selection
                    mode="multiple"
                    selectAllMode='allPages'
                    showCheckBoxesMode='always'
                />
                <Column
                    dataType="string"
                    caption="Número"
                    dataField="id"
                    width={110}
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
                    format="hh:mm"
                    dataField="hora"
                />
                <Column
                    dataType="number"
                    caption="Valor"
                    dataField='valor'
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
