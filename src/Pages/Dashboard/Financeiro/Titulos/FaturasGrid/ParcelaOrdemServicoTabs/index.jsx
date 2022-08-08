import React, { useState } from 'react';
import Tabs from 'devextreme-react/tabs';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import OrdemServico from './OrdemServico';
import ParcelasGrid from './ParcelasGrid';

export default function Index({ titulo }) {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const tabs = [
        { 
            id: 'ordem_servicos', 
            text: 'Ordens de Serviços', 
            element: <OrdemServico titulo={titulo}/> 
        },
        { 
            id: 'parcelas', 
            text: 'Parcelas',
            element: <ParcelasGrid titulo={titulo}/>
        }
    ];

    const handleTabClick = (e) => {        
        const indexLocal = tabs.map(t => t.id).indexOf(e.itemData.id);
        setSelectedIndex(indexLocal);
    };

    const renderTabs = () => tabs[selectedIndex].element;

    return (
        <>
            <Tabs
                dataSource={tabs}
                width={400}
                onItemClick={handleTabClick}
                selectedIndex={selectedIndex}
            />

            {renderTabs()}

        </>
    )
};

