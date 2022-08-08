import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';

export default function ParcelasGrid({ titulo }) {

    console.log('titulo', titulo);
    return (       
        <>
            <DataGrid
                dataSource={titulo.parcelas}
                showBorders={true}
                columnAutoWidth={true}
            >
                <Column 
                    dataField="vencimento" 
                    dataType="date" 
                />                
                <Column 
                    dataField="valor_nominal" 
                    dataType="number" 
                    format={{ 
                        style: 'currency', 
                        precision: 2, 
                        currency: 'BRL'
                    }}
                />
                <Column 
                    dataType="number" 
                    dataField="saldo" 
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

