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

import Content from '../../../../Componentes/Content';
import ParcelasGrid from './ParcelaTabs';

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

  return (
    <Content titulo="Contas à receber">
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

                <MasterDetail
                    enabled={true}
                    component={(param) => {
                        console.log(param);
                        const { data } = param.data;
                        return <ParcelasGrid titulo={data} getListTitulos={getListTitulos}/>
                    }}                
                />

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
                                        onClick={(e) => 0}
                                    />
                                </div>
                            </>
                        )
                    }}
                />

                <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                <Paging defaultPageSize={10} />



            </DataGrid>
    </Content>
  )
}
