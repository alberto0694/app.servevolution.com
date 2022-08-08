import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'devextreme-react/button';
import Content from '../../../../../Componentes/Content';
import { Navigate, useParams } from 'react-router-dom';
import DadosGerais from './DadosGerais';
import TabelaPreco from './TabelaPreco';
import TabelaFuncionario from './TabelaFuncionario';
import Tabs from 'devextreme-react/tabs';
import { NotificationManager } from 'react-notifications';
import ClienteModel from '../../../../../Models/Cliente.ts';
import history from '../../../../../Componentes/History';

import Loading from '../../../../../Componentes/Loading';

export default function Index() {

    const { cliente_id } = useParams();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [unidadesMedidas, setUnidadesMedidas] = useState([]);
    const [tipoServicos, setTipoServicos] = useState([]);
    const [showLoader, setShowLoader] = useState(false);  
    const [redirect, setRedirect] = useState(false);  
    const [cliente, setCliente] = useState(new ClienteModel());
    
    const tabs = [
        { 
            id: 'dados_gerais', 
            text: 'Dados Gerais', 
            element: <DadosGerais 
                        cliente={cliente} 
                        setCliente={(data) => setCliente({...data})}
                    /> 
        },
        { 
            id: 'tabela_preco', 
            text: 'Tabela de Preços',
            element: <TabelaPreco 
                        unidadesMedidas={unidadesMedidas}
                        tipoServicos={tipoServicos}
                        cliente={cliente}
                        setCliente={(data) => setCliente({...data})}
                    />
        },
        { 
            id: 'valores_funcionarios', 
            text: 'Funcionários',
            element: <TabelaFuncionario 
                        unidadesMedidas={unidadesMedidas}
                        tipoServicos={tipoServicos}
                        cliente={cliente}
                        setCliente={(data) => setCliente({...data})}
                    />
        }
    ];

    useEffect(() => {
        
        getUnidadesMedidas();
        getTipoServicos();
        getCliente();

    }, []);

    const getCliente = () => {

        if (cliente_id != null) {
            setShowLoader(true);
            axios.get(`api/clientes/get/${cliente_id}`)
                .then((response) => {                    
                    setCliente(response.data);
                    setShowLoader(false);
                })
                .catch((error) => {
                    setShowLoader(false);
                    NotificationManager.error(JSON.stringify(error), 'Cliente');
                });
        }

    }

    const getUnidadesMedidas = (e) => {

        axios.get('api/unidade-medida/list')
            .then((response) => {

                setUnidadesMedidas(response.data);

            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Cliente');
            });
    }; 
    
    const getTipoServicos = (e) => {

        axios.get('api/tipo-servicos/list')
            .then((response) => {

                setTipoServicos(response.data);

            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Cliente');
            });
    };   
    
    const salvarCliente = function (e) {

        setShowLoader(true);
        axios.post('api/clientes/createOrUpdate', cliente)
            .then((response) => {
                setRedirect(true);
                setShowLoader(false);
                NotificationManager.success('Cadastro realizado com sucesso.', 'Cliente');
            })
            .catch((error) => {
                setShowLoader(false);
                NotificationManager.error(JSON.stringify(error), 'Cliente');
            });
    };

    if (redirect) {
        return <Navigate to="/app/clientes" />
    }    


    const handleTabClick = (e) => {        
        const indexLocal = tabs.map(t => t.id).indexOf(e.itemData.id);
        setSelectedIndex(indexLocal);
    };    

    const renderTabs = () => tabs[selectedIndex].element;

    if (showLoader) {
        return <Loading />
    }

    return (
        <Content titulo="Cadastro de Cliente">
            <Tabs
                dataSource={tabs}
                width={400}
                onItemClick={handleTabClick}
                selectedIndex={selectedIndex}
            />

            <div className="tab-container">

                {renderTabs()}

                <div className="d-flex justify-end mt-4">
                    <Button
                        text="Voltar"
                        type="danger"
                        icon='fas fa-arrow-left'
                        stylingMode="contained"
                        onClick={() => history.back()}
                    />

                    <Button
                        text="Salvar"
                        className='ml-1'
                        type="success"
                        icon='fas fa-check'
                        stylingMode="contained"
                        onClick={(e) => salvarCliente(e)}
                    />
                </div>

                <div className="row">
                    <div className="form-group col-12">
                        <div className="d-flex justify-space-between">

                        </div>

                    </div>
                </div>
            </div>            
            
        </Content>
    )
}
