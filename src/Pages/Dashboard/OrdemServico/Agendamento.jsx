import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'devextreme-react/button';
import { NotificationManager } from 'react-notifications';
import { ButtonGroup } from 'devextreme-react/button-group';

import Content from '../../../Componentes/Content';
import Kanban from './Kanban';
import Listagem from './Listagem';
import Filter from './Filter';
import Loading from '../../../Componentes/Loading';

function Agendamento() {

    const itemsView = [
        {
            icon: 'bulletlist',
            key: 'list',
            hint: "Lista"
        },
        {
            icon: 'bookmark',
            key: 'kanban',
            hint: "Kanban"
        }
    ];

    const [showKanban, setShowKanban] = useState(true);
    const [agendamentos, setAgendamentos] = useState([]);
    const [showLoader, setShowLoader] = useState(false);    
    const [dataFilter, setDataFilter] = useState({});
    const [selectedView, setSelectedView] = useState(['kanban']);

    useEffect(() => {
        getListOrdemServico();
    }, [])

    const getListOrdemServico = (param) => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {

            const usuario = JSON.parse(localStorage.getItem("usuarioCache"));
            const queryParam = usuario.cliente?.length > 0 ? `?cliente_id=${usuario.cliente[0].id}` : '';

            axios.post(`/api/ordem-servicos/list${queryParam}`, param || dataFilter)
                .then((response) => {

                    setShowLoader(false);
                    setAgendamentos(response.data);
                    resolve(response);

                })
                .catch((error) => {
                    reject(error);
                    NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
                });
        });

    };

    const onModeViewClick = (e) => {
        setSelectedView([e.itemData.key]);
        setShowKanban(e.itemData.key == 'kanban');
    }

    const renderList = () => {
        
        if(showLoader) return <Loading />;

        if (showKanban) {
            const kbList = () => agendamentos.kanban ? agendamentos.kanban : [];
            return <Kanban agendamentos={{ columns: kbList() }} cbActionList={getListOrdemServico}/>
        } else { 
            return <Listagem data={agendamentos.list} cbActionList={getListOrdemServico}/> 
        }
    }

    const renderPage = () => {

        return (
            <>
                <div className="project-nav justify-content-end">
                    <div className="d-flex align-items-center">
                        <Link to={`/app/ordem-servico-create`} className="m-1">
                            <Button
                                text="Novo Agendamento"
                                type="normal"
                                icon='fas fa-plus'
                                stylingMode="contained"
                            />
                        </Link>

                        <ButtonGroup
                            className='float-end'
                            items={itemsView}
                            keyExpr="key"
                            stylingMode="outlined"
                            selectedItemKeys={selectedView}
                            onItemClick={onModeViewClick}
                        />
                    </div>
                </div>

                <Filter
                    callbackFilter={(cbParam) => {
                        getListOrdemServico(cbParam);
                        setDataFilter(cbParam);
                    }}
                />               

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="navpills-1" >
                        <div className="row dz-scroll loadmore-content searchable-items list" id="allContactListContent">
                            <div className="items items-header-section">
                            </div>

                            {renderList()}

                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Content titulo="Agendamentos">             
                {renderPage()}
            </Content>
        </>
    )
}

export default Agendamento