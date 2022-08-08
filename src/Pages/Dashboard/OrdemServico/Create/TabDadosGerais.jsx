import React from 'react';
import DateBox from 'devextreme-react/date-box';
import { TextArea } from 'devextreme-react/text-area';
import { SelectBox } from 'devextreme-react/select-box';
import { useState, useEffect } from 'react';
import moment from 'moment';

export default function TabDadosGerais(props) {

    const {
        ordemServico,
        clientes,
        tipoServicos,
        cbHandleChange
    } = props;

    const [horaInicial, setHoraInicial] = useState(null);
    const [horaFinal, setHoraFinal] = useState(null);

    useEffect(() => {

        if(!ordemServico.id) return; 

        const horaInicialArr = ordemServico.hora_inicial ? ordemServico.hora_inicial.split(":") : [];
        const horaFinalArr = ordemServico.hora_final ? ordemServico.hora_final.split(":") : [];

        if (horaInicialArr.length > 0) {
            const horaInicial = moment().set({ hour: horaInicialArr[0], minute: horaInicialArr[1], second: horaInicialArr[2], millisecond: 0 });
            setHoraInicial(horaInicial);
        }

        if (horaFinalArr.length > 0) {
            const horaFinal = moment().set({ hour: horaFinalArr[0], minute: horaFinalArr[1], second: horaFinalArr[2], millisecond: 0 });
            setHoraFinal(horaFinal);
        }

    }, []);


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
                    <label>Hora Inicial</label>
                    <DateBox
                        type="time"
                        useMaskBehavior={true}
                        value={horaInicial}
                        showClearButton={true}
                        displayFormat="HH:mm"
                        onValueChange={(value) => {
                            setHoraInicial(value);
                            cbHandleChange(moment(value).format('HH:mm:ss'), 'hora_inicial')
                        }}
                    />
                </div>

                <div className="form-group col-2">
                    <label>Hora Final</label>
                    <DateBox
                        type="time"
                        value={horaFinal}
                        showClearButton={true}
                        displayFormat="HH:mm"
                        onValueChange={(value) => {
                            setHoraFinal(value);
                            cbHandleChange(moment(value).format('HH:mm:ss'), 'hora_final')
                        }}
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
