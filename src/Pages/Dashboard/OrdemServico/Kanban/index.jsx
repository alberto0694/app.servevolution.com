import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'devextreme-react/popup';
import DateBox from 'devextreme-react/date-box';
import { TextArea } from 'devextreme-react/text-area';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import Board, { moveCard } from '@asseinfo/react-kanban';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
import '@asseinfo/react-kanban/dist/styles.css';

import './Index.css';
import Card from './Card';
import Loading from '../../../../Componentes/Loading';
import Filter from '../Filter';
import history from '../../../../Componentes/History';

export default function Index({ showLoaderParam }) {

    const [showLoader, setShowLoader] = useState(showLoaderParam);
    const [showLoaderOrdemServico, setShowLoaderOrdemServico] = useState(false);
    const [agendamentos, setAgendamentos] = useState({ columns: [] });
    const [showOrdemServico, setShowOrdemServico] = useState(false);
    const [ordemServico, setOrdemServico] = useState({});
    const [tipoServicos, setTipoServicos] = useState([]);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        getListOrdemServico();
    }, []);

    const getListOrdemServico = (dataFilter) => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {

            const usuario = JSON.parse(localStorage.getItem("usuarioCache"));
            const queryParam = usuario.cliente?.length > 0 ? `cliente_id=${usuario.cliente[0].id}` : '';

            axios.post(`/api/ordem-servicos/list-kanban?${queryParam}`, dataFilter || {})
                .then((response) => {
                    setShowLoader(false);
                    if (response.data.status === false) {
                        NotificationManager.error(response.data.message, 'Ordem de Serviço');
                    } else {
                        setAgendamentos({ columns: response.data });
                    }
                    resolve(response);
                })
                .catch((error) => {
                    setShowLoader(false);
                    NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
                    reject(error);
                });
        });
    };

    const getOrdemServico = (ordem_servico_id) => {
        return axios.get(`api/ordem-servicos/get/${ordem_servico_id}`);
    };

    const onCardClick = ({ id }) => {
        setShowLoaderOrdemServico(true);
        setShowOrdemServico(true);
        getOrdemServico(id)
            .then((response) => {
                setShowLoaderOrdemServico(false);
                if (response.data.status === false) {
                    setShowOrdemServico(false);
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    setOrdemServico(response.data);
                    setTipoServicos([response.data.servico]);
                    setClientes([response.data.cliente]);
                }
            })
            .catch((error) => {
                setShowLoaderOrdemServico(false);
            });
    }

    const onCardDragEnd = (board, source, destination) => {
        const localAgendamentos = moveCard(agendamentos, source, destination);
        setAgendamentos(localAgendamentos);
    }

    const renderOrdemServicoPopUp = () => {

        return (
            <>

                <Popup
                    width={650}
                    height={470}
                    showTitle={true}
                    title={'Ordem de Serviço'}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    visible={showOrdemServico}
                    onHiding={() => {
                        setShowOrdemServico(false)
                    }}
                    contentRender={() => {

                        if (showLoaderOrdemServico) {

                            return <Loading />

                        }
                        return (
                            <>
                                <form>
                                    <div className="row">

                                    <div className="form-group col-6">
                                            <label>Cliente</label>
                                            <SelectBox
                                                disabled={true}
                                                dataSource={clientes}
                                                displayExpr={(item) => {
                                                    return item?.pessoa.razao || item?.pessoa.apelido
                                                }}
                                                searchEnabled={true}
                                                searchMode='contains'
                                                searchExpr={['pessoa.razao', 'pessoa.apelido']}
                                                searchTimeout={200}
                                                minSearchLength={3}
                                                showDataBeforeSearch={true}
                                                valueExpr='id'
                                                value={ordemServico.cliente_id}
                                            />
                                        </div>

                                        <div className="form-group col-6">
                                            <label>Serviço</label>
                                            <SelectBox
                                                disabled={true}
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
                                            />
                                        </div>                                        

                                        <div className="form-group col-3">
                                            <label>Data</label>
                                            <DateBox
                                                disabled={true}
                                                defaultValue={new Date()}
                                                value={ordemServico.data}                                                
                                                displayFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className="form-group col-3">
                                            <label>Hora</label>
                                            <DateBox
                                                disabled={true}
                                                type="time"
                                                defaultValue={new Date()}
                                                value={ordemServico.hora}
                                                displayFormat="HH:mm"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Descrição</label>
                                            <TextArea
                                                disabled={true}
                                                height={120}
                                                className="form-control"
                                                value={ordemServico.descricao}                                                
                                            />
                                        </div>

                                        <div className="form-group">
                                            <div className="d-flex justify-end">
                                                <Button
                                                    text="Voltar"
                                                    type="normal"
                                                    icon='fas fa-arrow-left'
                                                    stylingMode="contained"
                                                    onClick={() => setShowOrdemServico(false)}
                                                />

                                                <Button
                                                    text="Rejeitar"
                                                    type="danger"
                                                    className="ml-1"
                                                    icon='fas fa-arrow-left'
                                                    stylingMode="contained"
                                                    onClick={() => 0}
                                                />

                                                <Button
                                                    text="Aprovar"
                                                    type="success"
                                                    className="ml-1"
                                                    icon='fas fa-save'
                                                    stylingMode="contained"
                                                    onClick={() => 0}
                                                />
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


    const renderKanban = () => {
        if (showLoader) {

            return <Loading />

        } else {
            return (
                <>
                    <Board
                        onCardDragEnd={onCardDragEnd}
                        renderColumnHeader={({ titulo }) => <span>{titulo}</span>}
                        renderCard={(data, { removeCard, dragging }) => {
                            const { servico } = data;

                            return (
                                <Card
                                    onClick={(e) => onCardClick(data)}
                                    dragging={dragging}
                                    task={data}
                                >
                                    <label className='w-full m-1 cursor-pointer bold'>{servico.descricao}</label>
                                    <label className='w-full m-1 cursor-pointer'>{moment(data.data).format("DD/MM/yyyy")} às {moment(data.hora).format("HH:mm")}</label>
                                    <div className="d-flex m-1 justify-end">
                                        {
                                            data.funcionarios?.map((func) => {
                                                return (
                                                    <img title={func.pessoa.razao || func.pessoa.apelido} className="rounded-circle m-1" width="30" src={func.pessoa.foto || "images/contacts/user.jpg"} alt="" />
                                                )
                                            })
                                        }
                                    </div>
                                </Card>
                            )
                        }}
                    >
                        {agendamentos}
                    </Board>

                    {renderOrdemServicoPopUp()}
                </>
            )
        }
    }


    return (
        <>

            <Filter
                callbackFilter={(dataFilter) => {
                    getListOrdemServico(dataFilter);
                }}
            />

            {renderKanban()}
        </>
    )


}
