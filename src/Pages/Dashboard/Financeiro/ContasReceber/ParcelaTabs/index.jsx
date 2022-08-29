import React, { useState } from 'react';
import { TabPanel, Item } from 'devextreme-react/tab-panel';
import ParcelasGrid from './ParcelasGrid';

export default function Index({ titulo, getListTitulos }) {


    return (
        <>
            <TabPanel>
                <Item title="Parcelas" render={() => <ParcelasGrid parcelas={titulo.parcelas} getListTitulos={getListTitulos} />} />
            </TabPanel>            
        </>
    )

};

