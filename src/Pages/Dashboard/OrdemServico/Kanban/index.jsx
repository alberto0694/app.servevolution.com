import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Board, { moveCard } from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import './Index.css';
import Card from './Card';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function Index({showLoaderParam}) {

    const [showLoader, setShowLoader] = useState(showLoaderParam);
    const [agendamentos, setAgendamentos] = useState({columns: []});

    useEffect(() => {
        getListOrdemServico();
    }, []);

    const getListOrdemServico = () => {

        setShowLoader(true);
        return new Promise((resolve, reject) => {
            axios.get('/api/ordem-servicos/list-kanban')
            .then((response) => {

                const localAgendamentos = response.data.map((cliente) => {
                    return { ...cliente, cards: cliente.ordem_servicos };
                });

                console.log('localAgendamentos', localAgendamentos);

                setShowLoader(false);                
                console.log()
                setAgendamentos({ columns: localAgendamentos });
                resolve(response);                      
            })
            .catch((error) => {
                reject(error);
                NotificationManager.error(JSON.stringify(error), 'Erro!');
            });
        });

    };

    const renderHeaderBoard = ({pessoa}) => {
        return (
            <>
                <span>{pessoa?.razao || pessoa?.apelido}</span>
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
