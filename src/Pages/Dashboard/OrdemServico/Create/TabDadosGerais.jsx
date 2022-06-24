import React from 'react';
import DateBox from 'devextreme-react/date-box';
import { TextArea } from 'devextreme-react/text-area';
import { SelectBox } from 'devextreme-react/select-box';

export default function TabDadosGerais(props) {

    const {
        ordemServico,
        clientes,
        tipoServicos,
        cbHandleChange
    } = props;

    return (
        <>
            <div className="row">
                <div className="form-group col-3">
                    <label>Data</label>
                    <DateBox
                        defaultValue={new Date()}
                        value={ordemServico.data}
                        showClearButton={true}
                        displayFormat="dd/MM/yyyy"
                        onValueChange={(value) => cbHandleChange(value, 'data')}
                    />
                </div>
                <div className="form-group col-2">
                    <label>Hora</label>
                    <DateBox
                        type="time"
                        defaultValue={new Date()}
                        value={ordemServico.hora}
                        showClearButton={true}
                        displayFormat="HH:mm"
                        onValueChange={(value) => cbHandleChange(value, 'hora')}
                    />
                </div>

                <div className="form-group col-3">
                    <label>Serviço</label>
                    <SelectBox
                        dataSource={tipoServicos}
                        displayExpr="descricao"
                        searchEnabled={true}
                        searchMode='contains'
                        searchExpr='descricao'
                        searchTimeout={200}
                        minSearchLength={3}
                        valueExpr='id'
                        value={ordemServico.tipo_servico_id}
                        showDataBeforeSearch={true}
                        onValueChange={(value) => cbHandleChange(value, 'tipo_servico_id')}
                    />
                </div>

                <div className="form-group col-4">
                    <label>Cliente</label>
                    <SelectBox
                        dataSource={clientes}
                        displayExpr='pessoa.normalized_name'
                        searchEnabled={true}
                        searchMode='contains'
                        searchExpr={['pessoa.razao', 'pessoa.apelido']}
                        searchTimeout={200}
                        minSearchLength={3}
                        showDataBeforeSearch={true}
                        valueExpr='id'
                        value={ordemServico.cliente_id}
                        onValueChange={(value) => cbHandleChange(value, 'cliente_id')}
                    />
                </div>
            </div>
            <div className="row">
                <div className="form-group">
                    <label>Descrição</label>
                    <TextArea
                        className="form-control"
                        value={ordemServico.descricao}
                        onValueChange={(value) => cbHandleChange(value, 'descricao')}
                    />
                </div>
            </div>
        </>
    )
}
