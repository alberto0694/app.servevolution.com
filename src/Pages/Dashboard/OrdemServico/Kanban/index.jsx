import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'devextreme-react/popup';
import Board, { moveCard } from '@asseinfo/react-kanban';
import { NotificationManager } from 'react-notifications';
import moment from 'moment';
import '@asseinfo/react-kanban/dist/styles.css';

import './Index.css';
import Card from './Card';
import Loading from '../../../../Componentes/Loading';
import Filter from '../Filter';

export default function Index({ showLoaderParam }) {

    const [showLoader, setShowLoader] = useState(showLoaderParam);
    const [showLoaderOrdemServico, setShowLoaderOrdemServico] = useState(false);
    const [agendamentos, setAgendamentos] = useState({ columns: [] });
    const [showOrdemServico, setShowOrdemServico] = useState(false);

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
                    if(response.data.status === false){
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
                if(response.data.status === false){
                    setShowOrdemServico(false);
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    //
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
                    width={660}
                    height={540}
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
                                <h1>content popup</h1>
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

            { renderKanban() }
        </>
    )


}
