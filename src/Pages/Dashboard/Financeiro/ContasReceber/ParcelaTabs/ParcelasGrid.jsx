import React, { useState } from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { NotificationManager } from 'react-notifications';
import { NumberBox } from 'devextreme-react/number-box';
import Button from 'devextreme-react/button';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Popup from 'devextreme-react/popup';
import axios from 'axios';
import { useEffect } from 'react';

export default function ParcelasGrid({ parcelas, getListTitulos }) {

    let swal = withReactContent(Swal);
    const [showModalTransacoes, setShowModalTransacoes] = useState(false);
    const [transacoes, setTransacoes] = useState([]);
    const [valorBaixado, setValorBaixado] = useState(0);
    const [parcelaId, setParcelaId] = useState(null);

    const closeModalTransacoes = () => {
        setTransacoes([]);
        setValorBaixado(0);
        setParcelaId(null);
        setShowModalTransacoes(false);
        
    }

    const getTransacoes = (parcela_id) => {

        setParcelaId(parcela_id);
        axios.get(`/api/financeiro/transacoesList?parcela_id=${parcela_id}`)
        .then((response) => {
            
            setTransacoes(response.data);

        })
        .catch((error) => {



        });

    }

    const baixarParcela = () => {


        axios.post(`/api/financeiro/baixarParcela`, 
        {
            parcela_id: parcelaId,
            valor_baixado: valorBaixado
        })
        .then((response) => {
            
            if(response.data.status === false){
                NotificationManager.error(response.data.message, 'Aviso');
                return;
            }

            getListTitulos();
            closeModalTransacoes();

        })
        .catch((error) => {

        });


    }

    const renderTransacoesModal = () => {

        return (
            <>
                <Popup
                    width={780}
                    height={500}
                    showTitle={true}
                    title={'Transações'}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    visible={showModalTransacoes}
                    onHiding={() => {
                        setShowModalTransacoes(false);
                    }}
                    contentRender={() => {

                        return (
                            <>
                                <DataGrid
                                    dataSource={transacoes}
                                    showBorders={true}
                                    columnAutoWidth={true}
                                >
                                    <Column
                                        caption="Baixado em"
                                        dataField="created_at"
                                        dataType="date"
                                    />
                                    <Column
                                        caption="Valor"
                                        dataField="valor_baixado"
                                        dataType="number"
                                        format={{
                                            style: 'currency',
                                            precision: 2,
                                            currency: 'BRL'
                                        }}
                                    />
                                </DataGrid>

                                <form className='mt-3'>
                                    <div className="row">
                                        {/* <div className="form-group col-5">
                                            <label>Custo</label>
                                            <SelectBox
                                                dataSource={[]}
                                                displayExpr="descricao"
                                                searchEnabled={true}
                                                searchMode='contains'
                                                searchExpr='descricao'
                                                searchTimeout={200}
                                                minSearchLength={3}
                                                valueExpr='id'
                                                // value={edtCusto.tipo_custo_id}
                                                showDataBeforeSearch={true}
                                                onValueChange={(value) => {

                                                }}
                                            />
                                        </div> */}

                                        <div className="form-group col-3">
                                            <label>Valor</label>
                                            <NumberBox
                                                className="form-control"
                                                defaultValue={0}
                                                showSpinButtons={true}
                                                value={valorBaixado}
                                                format={{
                                                    style: "currency",
                                                    currency: "BRL"
                                                }}
                                                onValueChange={(value) => {
                                                    setValorBaixado(value);
                                                }}
                                            />
                                        </div>

                                        <div className="form-group col-2 p-0">
                                            <label>&nbsp;</label>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm p-2 m-auto d-block"
                                                    onClick={() => {
                                                        baixarParcela()
                                                    }}
                                                >
                                                    <i className="fas fa-plus"></i> Baixar valor
                                                </button>
                                            </div>                                           
                                        </div>

                                        <div className="form-group col-2 p-0">
                                            <label>&nbsp;</label>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm p-2 w-75 m-auto d-block"
                                                    onClick={() => {
                                                        setShowModalTransacoes(false);
                                                    }}
                                                >
                                                    <i className="fas fa-plus"></i> Cancelar
                                                </button>
                                            </div>
                                            

                                        </div>
                                    </div>
                                </form>

                            </>)
                    }}
                />

            </>
        )


    }

    return (
        <>
            <DataGrid
                dataSource={parcelas}
                showBorders={true}
                columnAutoWidth={true}
            >
                <Column
                    dataField="vencimento"
                    dataType="date"
                    defaultSortOrder="asc"
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
                <Column
                    alignment="center"
                    caption="Ações"
                    width={120}
                    cellRender={(cellData) => {
                        const { data } = cellData;
                        return (
                            <>
                                <div className="d-flex justify-center">
                                    <Button
                                        text=""
                                        type="normal"
                                        icon='fas fa-trash'
                                        stylingMode="contained"
                                        onClick={(e) => {
                                            getTransacoes(data.id);
                                            setShowModalTransacoes(true);
                                            setValorBaixado(parseFloat(data.saldo));
                                        }}
                                    />
                                </div>
                            </>
                        )
                    }}
                />
            </DataGrid>

            {renderTransacoesModal()}
        </>
    )
};

