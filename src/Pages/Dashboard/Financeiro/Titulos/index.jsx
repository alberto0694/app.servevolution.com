import React, { useState, useEffect } from 'react';
import Content from '../../../../Componentes/Content';
import OrdemServicoGrid from './OrdemServicoGrid';
import FaturasGrid from './FaturasGrid';
import Tabs from 'devextreme-react/tabs';

export default function Index() {

    const [selectedIndex, setSelectedIndex] = useState(0);
   
    const tabs = [
        { 
            id: 'ordem_servicos', 
            text: 'Ordens de Serviços', 
            element: <OrdemServicoGrid/> 
        },
        { 
            id: 'titulos', 
            text: 'Títulos',
            element: <FaturasGrid/>
        }
    ];

    const handleTabClick = (e) => {        
        const indexLocal = tabs.map(t => t.id).indexOf(e.itemData.id);
        setSelectedIndex(indexLocal);
    };    

    const renderTabs = () => tabs[selectedIndex].element;

    return (
        <Content titulo="Títulos Financeiros">
            <Tabs
                dataSource={tabs}
                width={400}
                onItemClick={handleTabClick}
                selectedIndex={selectedIndex}
            />

            <div className="tab-container">
                {renderTabs()}
            </div>            
            
        </Content>
    )
}
