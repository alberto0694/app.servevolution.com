import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import { ButtonGroup } from 'devextreme-react/button-group';

import Content from '../../../Componentes/Content';
import Kanban from './Kanban';
import Listagem from './Listagem';

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
    const [selectedView, setSelectedView] = useState(['kanban']);

    const onModeViewClick = (e) => {
        setSelectedView([e.itemData.key]);
        setShowKanban(!showKanban);
    }

    const renderList = () => showKanban ? <Kanban /> : <Listagem />;

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