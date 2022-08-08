import React from 'react';
import DataGrid, {
    Column,
    Lookup,
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';

export default function GridFuncionariosCustos(props) {

    const {
        custos,
        tipoCustos,
        onRemoveCusto
    } = props;

    const normalizedCustos = (data) => {
        let arr_custos = [];
        const lc_custos = [...data];

        lc_custos.forEach((c) => {
            const lc_c = { ...c};
            const i = arr_custos.map(a => a.tipo_custo_id).indexOf(lc_c.tipo_custo_id);
            if(i >= 0){
                arr_custos[i].valor += lc_c.valor;
            } else {
                arr_custos.push(lc_c);
            }
        });

        return arr_custos;
    }

    return (
        <>
            <DataGrid
                className='border-list'
                dataSource={normalizedCustos(custos)}
                allowColumnReordering={true}>
                <Column
                    dataField="tipo_custo_id"
                    caption="Tipo de Custo"
                >
                    <Lookup
                        dataSource={tipoCustos}
                        displayExpr="descricao"
                        valueExpr="id"
                    />
                </Column>
                <Column
                    dataField="valor"
                    caption="Valor"
                    alignment="right"
                    format={{
                        style: 'currency',
                        currency: 'BRL',
                        useGrouping: true,
                        minimumSignificantDigits: 3                         
                    }}
                />
                <Column
                    caption="Ações"
                    alignment="center"
                    width={80}
                    visible={Boolean(onRemoveCusto)}
                    cellRender={(data) => {
                        return (
                            <>
                                <Button
                                    icon="fas fa-trash"
                                    className="btn btn-primary btn-sm color-red"
                                    onClick={(e) => onRemoveCusto(e, data)}
                                />
                            </>
                        );
                    }}

                />
            </DataGrid>

        </>
    )
}
