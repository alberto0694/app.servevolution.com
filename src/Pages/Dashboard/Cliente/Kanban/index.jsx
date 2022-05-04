import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Board, { moveCard } from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import './Index.css';
import Card from './Card';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function Index({showLoaderParam}) {

    const cliente = JSON.parse(localStorage.getItem("usuarioCache")).cliente[0];
    const [showLoader, setShowLoader] = useState(showLoaderParam);
    const [agendamentos, setAgendamentos] = useState({columns: []});

    useEffect(() => {
        getListOrdemServico();
    }, []);

    const getListOrdemServico = () => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {
            axios.get(`/api/clientes/list/ordem-servicos/kanban/${cliente.id}`)
            .then((response) => {                
                setShowLoader(false);
                setAgendamentos({ columns: response.data });
                resolve(response);                      
            })
            .catch((error) => {
                reject(error);
                NotificationManager.error(JSON.stringify(error), 'Erro!');
            });
        });

    };

    const renderHeaderBoard = ({data}) => {
        return (
            <>
                <span>{data}</span>
            </>            
        )
    }
    
    const onCardDragEnd = (board, source, destination) => {
        console.log('board', destination);
        const localAgendamentos = moveCard(agendamentos, source, destination);
        setAgendamentos(localAgendamentos);
    }

    return (
        <>
            <Board
                onCardDragEnd={onCardDragEnd}
                renderColumnHeader={renderHeaderBoard}
                renderCard={({ titulo }, { removeCard, dragging }) => (
                    <Card dragging={dragging}>
                      <p>{titulo}</p>
                    </Card>
                  )}
            >
                {agendamentos}
            </Board>
        </>
    )

}
