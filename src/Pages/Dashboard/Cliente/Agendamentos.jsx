import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import Kanban from './Kanban';

import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
} from 'devextreme-react/data-grid';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Content from '../../../Componentes/Content';
import OrdemServicoModel from '../../../Models/OrdemServico.ts';
import { NotificationContainer, NotificationManager } from 'react-notifications';

function AgendamentosCliente() {

    const cliente = JSON.parse(localStorage.getItem("usuarioCache")).cliente[0];
    const [ showLoader, setShowLoader ] = useState(true);
    const [ agendamentos, setAgendamentos ] = useState([]);
    const [showKanban, setShowKanban] = useState(true);
    const swal = withReactContent(Swal);
    
    useEffect(() => {
        getListOrdemServico();
    }, [])
    
    const getListOrdemServico = () => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {
            axios.get(`/api/clientes/list/ordem-servicos/${cliente.id}`)
            .then((response) => {
    
                setShowLoader(false);
                setAgendamentos(response.data);
                resolve(response);
                        
            })
            .catch((error) => {
                reject(error);
                NotificationManager.error(JSON.stringify(error), 'Erro!');
            });
        });

    };

    const showModalExcluir = (e, agendamento) => {

        if (agendamento == null){ 
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
            
            if(response.isConfirmed){                
            
                axios.get(`api/ordem-servicos/delete/${agendamento.id}`)
                    .then((response) => {                    
                        NotificationManager.success('Ordem de serviço excluído', 'Excluído com sucesso!');
                        getListOrdemServico();
                    })
                    .catch((error) => {
                        NotificationManager.error(JSON.stringify(error), 'Erro ao excluir!');
                    });

            }
        });

    };

    const renderList = () => {

        if(showKanban){

            return <Kanban showLoaderParam={showLoader}/>

        } else {
            
            return (
                <>
                    <DataGrid
                        dataSource={agendamentos}
                        allowColumnReordering={true}
                        rowAlternationEnabled={true}
                        showBorders={true}
                    >
                        <GroupPanel visible={true} />
                        <SearchPanel visible={true} highlightCaseSensitive={true} />
                        <Grouping autoExpandAll={false} />


                        <Column
                            dataField="titulo"
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
                                        <div className="d-flex">
                                            <Link to={`/app/ordem-servico-create/${data.id}`} className="btn btn-primary shadow btn-xs sharp me-1"><i className="fas fa-pencil-alt"></i></Link>
                                            <button onClick={(e) => showModalExcluir(e, data)} className="btn btn-danger shadow btn-xs sharp"><i className="fa fa-trash"></i></button>
                                        </div>
                                    </>
                                )
                            }}
                        />

                        <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                        <Paging defaultPageSize={10} />
                    </DataGrid>
                </>
            );

        }

    }

    const renderPage = () => {

        if(showLoader){

            return (
                <>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            );

        } else {

            return(
                <>
                    <div className="project-nav justify-content-end">
                        <div className="d-flex align-items-center">
                            
                            {/* <Link to={`/app/ordem-servico-create`} className="m-1">
                                <Button
                                    text="Novo Agendamento"
                                    type="normal"
                                    icon='fas fa-plus'
                                    stylingMode="contained"
                                />                            
                            </Link> */}

                        </div>
                    </div>
    
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navpills-1" >
                            <div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">
                                <div className="items items-header-section">
                                </div>
                                
                                { renderList() }

                            </div>
                        </div>
                    </div>
    
                </>
            );
        }
       
    }

    return (
        <>
            <Content titulo="Agendamentos">

                { renderPage() }
                
            </Content>

            <NotificationContainer />

        </>
    )
}

export default AgendamentosCliente