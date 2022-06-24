import React, { useState } from 'react';
import axios from 'axios';
import Popup from 'devextreme-react/popup';
import DateBox from 'devextreme-react/date-box';
import { TextArea } from 'devextreme-react/text-area';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import Board from '@asseinfo/react-kanban';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import Card from './Card';
import Loading from '../../../../Componentes/Loading';
import DropDownButton from 'devextreme-react/drop-down-button';
//import history from '../../../../Componentes/History';

import '@asseinfo/react-kanban/dist/styles.css';
import './Index.css';



export default function Index({ agendamentos }) {

    const navigate = useNavigate();
    
    const actionsCard = [
        { 
            text: 'Editar', 
            icon: 'fas fa-edit', 
            class: "color-blue",
            action: (data) => {
                navigate(`/app/ordem-servico-create/${data.id}`)
            }
        },
        {
            text: 'Finalizar', 
            icon: 'fas fa-end', 
            class: "color-orange",
            action: (data) => {
                return;
            }
        },
        { 
            text: 'Excluir', 
            icon: 'fas fa-trash', 
            class: "color-red",
            action: (data) => {
                return;
            }        
        }
    ];

    const [showLoaderOrdemServico, setShowLoaderOrdemServico] = useState(false);
    const [showOrdemServico, setShowOrdemServico] = useState(false);
    const [ordemServico, setOrdemServico] = useState({});
    const [tipoServicos, setTipoServicos] = useState([]);
    const [clientes, setClientes] = useState([]);

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

    // const onCardDragEnd = (board, source, destination) => {
    //     //const localAgendamentos = moveCard(agendamentos, source, destination);
    //     //setAgendamentos(localAgendamentos);
    // }

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
                                                displayExpr='pessoa.normalized_name'
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

    return (
        <>
            <Board
                // onCardDragEnd={onCardDragEnd}
                renderColumnHeader={({ titulo }) => <span>{titulo}</span>}
                renderCard={(localData, { removeCard, dragging }, index) => {
                    const { servico } = localData;

                    return (
                        <Card
                            onClick={(e) => onCardClick(localData)}
                            dragging={dragging}
                            task={localData}
                        >
                            <div className="d-flex m-1 justify-space-between">
                                <div>
                                    <label className='w-full m-1 cursor-pointer bold'>{servico.descricao}</label>
                                    <label className='w-full m-1 cursor-pointer'>{moment(localData.data).format("DD/MM/yyyy")} às {moment(localData.hora).format("HH:mm")}</label>
                                </div>
                                <div>

                                    <DropDownButton
                                        text=""
                                        icon="fas fa-trash"
                                        showArrowIcon={false}
                                        stylingMode='text'
                                        dropDownOptions={{width: 100}}
                                        focusStateEnabled={false}
                                        items={actionsCard}
                                        onItemClick={(e) => {
                                            console.log('e', e);
                                            if(e.itemData.action)
                                                e.itemData.action(servico);                                            
                                            e.event.stopPropagation();
                                        }}
                                        onButtonClick={(e) => {
                                            e.event.stopPropagation();
                                        }}
                                        itemRender={(e) => {
                                            console.log('e', e)
                                            return (
                                                <>
                                                    <div className={`disable-click ${e.class}`}>
                                                        <i className="fas fa-trash"></i> {e.text}                                                                             
                                                    </div>                                                    
                                                </>
                                            )
                                        }}
                                    />

                                </div>
                            </div>
                            
                            <div className="d-flex m-1 justify-end">                                
                                {
                                    localData.funcionarios?.map((func) => {
                                        return (
                                            <img title={func.pessoa.normalized_name} className="rounded-circle m-1" width="30" src={func.pessoa.foto || "images/contacts/user.jpg"} alt="" />
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
