import React, { useState } from 'react';
import Tabs from 'devextreme-react/tabs';
import { TabPanel, Item } from 'devextreme-react/tab-panel';
import OrdemServico from './OrdemServico';
import ParcelasGrid from './ParcelasGrid';
import { useEffect } from 'react';

export default function Index({ titulo }) {

    return (
        <>
            <TabPanel>
                <Item title="Ordens de Serviços" render={() => <OrdemServico ordemServicos={titulo.ordem_servicos}/> } />
                <Item title="Parcelas" render={() => <ParcelasGrid parcelas={titulo.parcelas}/>} />
            </TabPanel>            
        </>
    )

};

