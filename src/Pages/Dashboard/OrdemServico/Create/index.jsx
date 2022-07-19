import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'devextreme-react/button';
import { NotificationManager } from 'react-notifications';


import Tabs from 'devextreme-react/tabs';
import history from '../../../../Componentes/History';
import OrdemServico from '../../../../Models/OrdemServico';

import Content from '../../../../Componentes/Content';
import Loading from '../../../../Componentes/Loading';

import TabDadosGerais from './TabDadosGerais';
import TabFuncionario from './TabFuncionario';

const tabs = [
    { id: 'dados_gerais', text: 'Dados Gerais' },
    { id: 'funcionarios', text: 'Funcionários' }
];

export default function OrdemServicoCreate() {

    const { ordem_servico_id } = useParams();
    let swal = withReactContent(Swal);

    const [redirect, setRedirect] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [tabVisible, setTabVisible] = useState(tabs[0].id);

    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [tipoCustos, setTipoCustos] = useState([]);
    const [tipoServicos, setTipoServicos] = useState([]);

    const [ordemServico, setOrdemServico] = useState(new OrdemServico());
    const [titulo, setTitulo] = useState("Ordem de Serviço")

    useEffect(() => {
        getClientes();
        getTipoServicos();
        getTipoCustos();
        getFuncionarios();
        getOrdemServico();
    }, []);

    useEffect((e) => {
        const t = ordemServico.id ? `Ordem de serviço ${ordemServico.id}` : "Ordem de serviço";
        setTitulo(t);
    }, [ordemServico]);

    const handleTabClick = (e) => {
        setTabVisible(e.itemData.id);
    };

    const handleChange = function (value, attr) {
        ordemServico[attr] = value;
        setOrdemServico({ ...ordemServico });
    };

    const getOrdemServico = () => {
        if (ordem_servico_id != null) {
            axios.get(`api/ordem-servicos/get/${ordem_servico_id}`)
                .then((response) => {

                    setOrdemServico(response.data);
                    setShowLoader(false);
                })
                .catch((error) => {
                    NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
                });
        } else {
            setShowLoader(false);
        }
    };

    const getClientes = () => {
        axios.get(`api/clientes/list`)
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
            });
    };

    const getFuncionarios = () => {
        axios.get(`api/funcionario/list`)
            .then((response) => {
                if (response.data.status === false) {
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    setFuncionarios(response.data);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
            });
    };

    const getTipoCustos = () => {
        axios.get(`api/tipo-custos/list`)
            .then((response) => {
                if (response.data.status === false) {
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    setTipoCustos(response.data);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
            });
    };

    const getTipoServicos = () => {
        axios.get(`api/tipo-servicos/list`)
            .then((response) => {
                if (response.data.status === false) {
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    setTipoServicos(response.data);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
            });
    };

    const salvarOrdemServico = (e) => {

        setShowLoader(true);

        axios.post('api/ordem-servicos/createOrUpdate', ordemServico)
            .then((response) => {
                setShowLoader(false);
                if (response.data.status === false) {
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    setRedirect(true);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
            });

    };

    const renderTabs = () => {
        if (tabVisible == 'dados_gerais') {
            return (
                <>
                    <TabDadosGerais
                        ordemServico={ordemServico}
                        clientes={clientes}
                        tipoServicos={tipoServicos}
                        cbHandleChange={(value, attr) => {
                            handleChange(value, attr)
                        }}
                    />
                </>
            )
        } else if (tabVisible == 'funcionarios') {
            return (
                <>
                    <TabFuncionario
                        ordemServico={ordemServico}
                        funcionarios={funcionarios}
                        tipoCustos={tipoCustos}
                        cbSetFuncionarios={(data) => {
                            ordemServico.funcionarios = data;
                            setOrdemServico({ ...ordemServico })
                        }}
                        cbSetCustos={(data) => {
                            ordemServico.custos = data;
                            setOrdemServico({ ...ordemServico })
                        }}
                    />
                </>
            )

        }
    }

    const renderPage = () => {

        if (showLoader) {

            return <Loading />

        } else {

            return (
                <>
                    <form>

                        <Tabs
                            dataSource={tabs}
                            width={400}
                            onItemClick={handleTabClick}
                            selectedIndex={tabs.map(t => t.id).indexOf(tabVisible)}
                        />

                        <div className="tab-container">

                            {renderTabs()}

                            <div className="row">
                                <div className="form-group col-12">
                                    <div className="d-flex justify-space-between">

                                        <Button
                                            text="Excluir Ordem de Serviço"
                                            type="danger"
                                            icon='fas fa-trash'
                                            stylingMode="contained"
                                            onClick={() => history.back()}
                                        />

                                        <div>
                                            <Button
                                                text="Salvar"
                                                type="success"
                                                icon='fas fa-save'
                                                stylingMode="contained"
                                                onClick={() => salvarOrdemServico()}
                                            />

                                            <Button
                                                text="Cancelar"
                                                type="default"
                                                className="ml-1"
                                                icon='fas fa-arrow-left'
                                                stylingMode="contained"
                                                onClick={() => history.back()}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </form>
                </>
            );
        }
    }

    if (redirect) {
        return <Navigate to="/app/ordem-servicos/agendamentos" />
    }

    return (
        <>
            <Content titulo={titulo}>
                {renderPage()}
            </Content>
        </>
    )
}
