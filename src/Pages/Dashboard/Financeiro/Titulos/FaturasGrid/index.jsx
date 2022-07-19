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

    if(showLoader){
        return <Loading/>
    }

    return (
        <>
            {/* <div className="d-flex justify-start">
                <Button
                    text="Gerar titulo"
                    type="normal"
                    icon='fas fa-plus'
                    stylingMode="contained"
                    onClick={gerarTitulo}
                />
            </div>         */}


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
                <Selection
                    mode="multiple"
                    selectAllMode='allPages'
                    showCheckBoxesMode='always'
                />
                <Column
                    dataType="string"
                    caption="Número"
                    dataField='id'
                />
                <Column
                    dataType="string"
                    caption="Valor Nominal"
                    dataField='valor_nominal'
                    format='currency'
                    precision={3}
                />
                <Column
                    dataType="string"
                    caption="Valor Atualizado"
                    dataField='valor_atualizado'
                />
                <Column
                    dataType="string"
                    caption="Valor Baixado"
                    dataField='valor_baixado'
                />
                <Column
                    dataType="string"
                    caption="Saldo"
                    dataField='saldo'
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
