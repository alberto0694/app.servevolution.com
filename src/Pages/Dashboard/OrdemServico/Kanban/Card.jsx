import React from 'react';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom";
import DropDownButton from 'devextreme-react/drop-down-button';
import { NotificationManager } from 'react-notifications';

export default function Card({ task, onClick, cbActionList }) {
    
    const swal = withReactContent(Swal);
    const navigate = useNavigate();
    const { servico } = task;
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
            icon: 'fas fa-clipboard-list',
            class: "color-orange",
            action: (data) => {
                
                axios.get(`api/ordem-servicos/valor-servico-os/${data.id}`)
                        .then((response) => {
                            const { unidade_medida } = response.data;
                            swal.fire({
                                title: 'Finalizar Ordem de Serviço',
                                text: `Informe a quantidade de ${unidade_medida?.descricao || 'trabalho'}(s)`,
                                icon: 'warning',
                                confirmButtonText: 'Sim, Finalizar',
                                confirmButtonColor: '#f89406',
                                focusCancel: true,           
                                showCancelButton: true,              
                                cancelButtonText: 'Não, cancelar',
                                input: 'number',
                                inputPlaceholder: `Informe a quantidade de ${unidade_medida?.descricao || 'trabalho'}(s)`,                   
                                showCancelButton: true,
                                inputValidator: (value) => { }                    
                            })
                                .then((response) => {
                                    if (response.isConfirmed) {
                                        axios.post(`/api/ordem-servicos/finalizar/${data.id}`, { quantidade_trabalho: response.value })
                                            .then((response) => {
                                                if (response.data.status === false) {
                                                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                                                } else {
                                                    NotificationManager.success('Finalizado com sucesso', 'Ordem de Serviço');
                                                    cbActionList();
                                                }                                   
                                            })
                                            .catch((error) => NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço'));
                                    }    
                                });
                        });                
            }
        },
        { 
            text: 'Excluir', 
            icon: 'fas fa-trash', 
            class: "color-red",
            action: (data) => {
                swal.fire({
                    title: 'Excluir Ordem de Serviço',
                    text: `Deseja realmente excluir esta ordem de serviço?`,
                    icon: 'warning',
                    confirmButtonText: 'Sim, excluir',
                    focusCancel: true,
                    confirmButtonColor: '#d9534f',
                    showCancelButton: true,
                    cancelButtonText: 'Não, cancelar',
                })
                    .then((response) => {        
                        if (response.isConfirmed) {
                            axios.get(`/api/ordem-servicos/delete/${data.id}`)
                            .then((response) => {
                                if (response.data.status === false) {
                                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                                } else {
                                    NotificationManager.success('Deletado com sucesso', 'Ordem de Serviço');
                                    cbActionList();
                                }                                   
                            })
                            .catch((error) => NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço'));
                        }    
                    });
            }        
        }
    ];
    

    return (
        <>
            <div id="kanban">
                <div onClick={onClick} className="card dx-card dx-theme-text-color dx-theme-background-color">
                    <div className={`card-priority priority-${task.active_status}`}></div>
                    <div className="card-subject">

                        <div className="d-flex m-1 justify-space-between">
                            <div>
                                <label className='w-full m-1 cursor-pointer bold'>{task.id} - {servico.descricao}</label>
                                <label className='w-full m-1 cursor-pointer'>{moment(task.data).format("DD/MM/yyyy")} às {moment(`${task.data} ${task.hora_inicial}`).format("HH:mm")}</label>
                            </div>
                            <div>
                                <DropDownButton
                                    text=""
                                    icon="fas fa-ellipsis-v"
                                    showArrowIcon={false}   
                                    stylingMode='text'
                                    dropDownOptions={{ width: 100 }}
                                    focusStateEnabled={false}
                                    items={actionsCard}
                                    onItemClick={(e) => {
                                        if (e.itemData.action)
                                            e.itemData.action(task);
                                        e.event.stopPropagation();
                                    }}
                                    onButtonClick={(e) => {
                                        e.event.stopPropagation();
                                    }}
                                    itemRender={(e) => {
                                        return (
                                            <>
                                                <div className={`disable-click ${e.class}`}>
                                                    <i className={e.icon}></i> {e.text}
                                                </div>
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        <div className="d-flex m-1 justify-end">
                            {
                                task.funcionarios?.map((func) => {
                                    return (
                                        <img title={func.pessoa.normalized_name} className="rounded-circle m-1" width="30" src={func.pessoa.foto || "images/contacts/user.jpg"} alt="" />
                                    )
                                })
                            }
                        </div>


                    </div>
                    <div className="card-assignee">
                        {/* {children} */}
                    </div>
                </div>
            </div>
        </>
    )
}
