import React from 'react';
import {
    DataGrid,
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
    Selection,
    FilterRow
} from 'devextreme-react/data-grid';

export default function OrdemServico({ titulo }) {

    return (
        <>
            <DataGrid
                dataSource={titulo.ordem_servicos}
                showBorders={true}
                columnAutoWidth={true}
            >
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
                    caption="Horário"
                    width={80}
                    format="HH:mm"
                    calculateCellValue={(data) => `${data.hora_inicial} até ${data.hora_final}`}
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
            </DataGrid>

        </>
    )
};

