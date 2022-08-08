import React from 'react';
import axios from 'axios';
import { Button } from 'devextreme-react/button';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
    FilterRow
} from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';

export default function Listagem({ data }) {

    const swal = withReactContent(Swal);

    const showModalExcluir = (e, agendamento) => {

        if (agendamento == null) {
            swal.fire('Ordem de serviço não encontrado!');
            return;
        }

        swal.fire({
            title: 'Exclusão de ordem de serviço!',
            text: 'Deseja realmente excluir este registro?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
            .then((response) => {

                if (response.isConfirmed) {

                    axios.get(`api/ordem-servicos/delete/${agendamento.id}`)
                        .then((response) => {
                            NotificationManager.success('Ordem de serviço excluído', 'Excluído com sucesso!');
                        })
                        .catch((error) => {
                            NotificationManager.error(JSON.stringify(error), 'Erro ao excluir!');
                        });

                }
            });

    };

    return (
        <>
            <DataGrid
                dataSource={data}
                allowColumnReordering={true}
                rowAlternationEnabled={true}
                showBorders={true}
            >
                <GroupPanel visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} />
                <Grouping autoExpandAll={false} />
                <FilterRow visible={true} applyFilter='auto' />

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
                                    <Link to={`/app/ordem-servico-create/${data.id}`}>
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

                <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                <Paging defaultPageSize={10} />
            </DataGrid>
        </>
    )
}
