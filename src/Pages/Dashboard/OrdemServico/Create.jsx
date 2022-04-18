import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Popup from 'devextreme-react/popup';
import { TextBox } from 'devextreme-react/text-box';
import { TextArea } from 'devextreme-react/text-area';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import DataGrid, {
    Column,
    Lookup,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
} from 'devextreme-react/data-grid';
import List from 'devextreme-react/list';

import history from '../../../Componentes/History';
import OrdemServico from '../../../Models/OrdemServico';
import OrdemServicoCusto from '../../../Models/OrdemServicoCusto';
import Funcionario from '../../../Models/Funcionario';
import Content from '../../../Componentes/Content';

export default function OrdemServicoCreate() {

    const { ordem_servico_id } = useParams();
    let swal = withReactContent(Swal);

    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [tipoCustos, setTipoCustos] = useState([]);
    const [tipoServicos, setTipoServicos] = useState([]);

    const [ordemServico, setOrdemServico] = useState(new OrdemServico());
    const [selectedFuncionario, setSelectedFuncionario] = useState(new Funcionario());
    const [focusedFuncionario, setFocusedFuncionario] = useState(new Funcionario());
    const [edtCusto, setEdtCusto] = useState(new OrdemServicoCusto());
    const [custosFocusedFuncionario, setCustosFocusedFuncionario] = useState([]);



    const [redirect, setRedirect] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [addCustoVisible, setAddCustoVisible] = useState(false);

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

    useEffect((e) => {

        if (focusedFuncionario.id) {
            const c = ordemServico.custos.filter((custo) => {
                return custo.ordem_servico_funcionario.funcionario_id == focusedFuncionario.id;
            });
            setCustosFocusedFuncionario(c);
        }

    }, [focusedFuncionario]);

    const handleChange = function (value, attr) {
        ordemServico[attr] = value;
        setOrdemServico({ ...ordemServico });
    };

    const getOrdemServico = () => {
        if (ordem_servico_id != null) {
            axios.get(`api/ordem-servicos/get/${ordem_servico_id}`)
                .then((response) => {

                    setOrdemServico({ ...response.data });
                    setShowLoader(false);
                })
                .catch((error) => {
                    console.log('error', error);
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
                console.log('error', error);
            });
    };

    const getFuncionarios = () => {
        axios.get(`api/funcionario/list`)
            .then((response) => {
                setFuncionarios(response.data);
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    const getTipoServicos = () => {
        axios.get(`api/tipo-custos/list`)
            .then((response) => {
                setTipoCustos(response.data);
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    const getTipoCustos = () => {
        axios.get(`api/tipo-servicos/list`)
            .then((response) => {
                setTipoServicos(response.data);
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    const salvarOrdemServico = (e) => {

        setShowLoader(true);

        axios.post('api/ordem-servicos/createOrUpdate', ordemServico)
            .then((response) => {

                setRedirect(true);

            })
            .catch((error) => {
                console.log('error', error);
            });

    };

    const adicionarFuncionario = () => {
        ordemServico.funcionarios = [...ordemServico.funcionarios, selectedFuncionario];
        setOrdemServico({ ...ordemServico });
        setSelectedFuncionario(new Funcionario());
    }

    const adicionarCusto = () => {
        console.log('ordemServico.custos, edtCusto', ordemServico.custos, edtCusto);
        ordemServico.custos = [...ordemServico.custos, edtCusto];
        setOrdemServico({ ...ordemServico });
        setEdtCusto(new OrdemServicoCusto());
    }

    const openAddCusto = () => {

        if (focusedFuncionario.id) {
            edtCusto.ordem_servico_funcionario.funcionario_id = focusedFuncionario.id;
            setEdtCusto({ ...edtCusto });
            setAddCustoVisible(true);
        } else {
            alert('selecione um funcionario');
        }

    }

    const renderGrid = () => {
        const src = focusedFuncionario.id ? custosFocusedFuncionario : ordemServico.custos;

        return (
            <>
                <DataGrid
                    dataSource={src}
                    allowColumnReordering={true}>
                    <Column
                        dataField="tipo_custo_id"
                        caption="Tipo de Custo"
                    >
                        <Lookup
                            dataSource={tipoCustos}
                            displayExpr="descricao"
                            valueExpr="id"
                        />
                    </Column>
                    <Column
                        dataField="valor"
                        caption="Valor"
                        alignment="right"
                    />
                    <Column
                        caption="Ações"
                        alignment="center"
                        width={80}
                        cellRender={(data) => {
                            return (
                                <>
                                    <Button
                                        type="normal"
                                        icon='fas fa-plus'
                                        stylingMode="contained"
                                        onClick={() => 0}
                                    />
                                </>
                            );
                        }}

                    />
                </DataGrid>
            </>
        );        
    }

    const renderPage = () => {

        if (showLoader) {

            return (
                <>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            );

        } else {

            return (
                <>
                    <form>
                        <div className="row">

                            <div className="form-group col-3">
                                <label>Titulo</label>
                                <TextBox
                                    className="form-control"
                                    value={ordemServico.titulo}
                                    onValueChange={(value) => handleChange(value, 'titulo')}
                                />
                            </div>

                            <div className="form-group col-4">
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
                                    onValueChange={(value) => handleChange(value, 'tipo_servico_id')}
                                />
                            </div>

                            <div className="form-group col-5">
                                <label>Cliente</label>
                                <SelectBox
                                    dataSource={clientes}
                                    displayExpr="pessoa.razao"
                                    searchEnabled={true}
                                    searchMode='contains'
                                    searchExpr='pessoa.razao'
                                    searchTimeout={200}
                                    minSearchLength={3}
                                    showDataBeforeSearch={true}
                                    valueExpr='id'
                                    value={ordemServico.cliente_id}
                                    onValueChange={(value) => handleChange(value, 'cliente_id')}

                                />
                            </div>

                            <div className="form-group">
                                <label>Descrição</label>
                                <TextArea
                                    className="form-control"
                                    value={ordemServico.descricao}
                                    onValueChange={(value) => handleChange(value, 'descricao')}
                                />
                            </div>

                            <div className="container m-0 p-4 col-5">
                                <div className="form-group  row">
                                    <label>Escolha um funcionário para adicionar</label>
                                    <div className="col-8">
                                        <SelectBox
                                            dataSource={funcionarios}
                                            // itemTemplate={(funcionario) => {
                                            //     return funcionario.pessoa.razao || funcionario.pessoa.apelido;
                                            // }}
                                            displayExpr="pessoa.apelido"
                                            searchEnabled={true}
                                            searchMode='contains'
                                            searchExpr='pessoa.razao'
                                            searchTimeout={200}
                                            minSearchLength={3}
                                            showDataBeforeSearch={true}
                                            valueExpr='id'
                                            value={selectedFuncionario.id}
                                            onValueChange={(value) => {
                                                const func = funcionarios.find(f => f.id == value);
                                                setSelectedFuncionario(func);
                                            }}
                                        />
                                    </div>

                                    <div className="col-4">
                                        <Button
                                            type="normal"
                                            icon='fas fa-plus'
                                            stylingMode="contained"
                                            onClick={adicionarFuncionario}
                                        />
                                    </div>

                                </div>

                                <div className="form-group">
                                    <List
                                        dataSource={[
                                            {
                                                descricao: "Todos",
                                                id: 0
                                            }
                                        ]}
                                        className="m-0"
                                        style={{ background: 'white' }}
                                        itemRender={(funcionario) => {
                                            return funcionario.descricao
                                        }}
                                        valueExpr='id'
                                        onItemClick={(event) => {
                                            setFocusedFuncionario(new Funcionario());
                                        }}
                                    />
                                    <List
                                        dataSource={ordemServico.funcionarios}
                                        className="m-0"
                                        style={{ background: 'white' }}
                                        itemRender={(funcionario) => {
                                            return funcionario.pessoa.razao || funcionario.pessoa.apelido;
                                        }}
                                        valueExpr='id'
                                        onItemClick={(event) => {
                                            setFocusedFuncionario(event.itemData);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="container m-0 col-7">
                                <div className="form-group">
                                    <div className="col-12">
                                        <div className="right-box-padding">

                                            <div className="read-content">
                                                <div className="media pt-3 d-sm-flex d-block justify-content-between">
                                                    <div className="clearfix d-flex">
                                                        <img className="me-3 rounded" width="70" height="70" alt="image" src={ focusedFuncionario.pessoa.foto ?? "images/contacts/user.jpg" } />
                                                        <div className="media-body me-2">
                                                            <h5 className="text-primary mb-0 mt-1">{focusedFuncionario.pessoa.razao || focusedFuncionario.pessoa.apelido}</h5>
                                                            <p className="mb-0">{focusedFuncionario.pessoa.contatoImediato}</p>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix">
                                                        <Button
                                                            type="danger"
                                                            visible={Boolean(focusedFuncionario.id)}
                                                            icon='fas fa-trash'
                                                            stylingMode="contained"
                                                            onClick={() => {
                                                                swal.fire({
                                                                    title: 'Retirar funcionário',
                                                                    text: `Deseja realmente retirar ${focusedFuncionario.pessoa.razao || focusedFuncionario.pessoa.apelido} desta ordem de serviço?`,
                                                                    icon: 'question',
                                                                    confirmButtonText: 'Sim',
                                                                    showCancelButton: true,
                                                                    cancelButtonText: 'Não, cancelar',
                                                                })
                                                                .then((response) => {
                                                                    
                                                                    if(response.isConfirmed){                
                                                                    
                                                                        if(ordemServico.id && focusedFuncionario.id){
                                                                            axios.post(`api/ordem-servicos/funcionario/delete/${ordemServico.id}/${focusedFuncionario.id}`, ordemServico)
                                                                            .then((response) => {                                                                                 
                                                                                setOrdemServico(response.data);
                                                                                NotificationManager.success('Funcionário removido', 'Excluído com sucesso!');
                                                                            })
                                                                            .catch((error) => {
                                                                                NotificationManager.error(JSON.stringify(error), 'Erro ao excluir!');
                                                                            });
                                                                        } else {

                                                                        }
                                                                        
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="media mb-2">

                                                    {renderGrid()}

                                                </div>
                                                <div className="media mb-2">
                                                    <Button
                                                        type="normal"
                                                        text='Adicionar custos'
                                                        icon='fas fa-plus'
                                                        stylingMode="contained"
                                                        onClick={openAddCusto}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <Button
                                    text="Salvar"
                                    type="success"
                                    width={110}
                                    height={30}
                                    icon='fas fa-save'
                                    stylingMode="contained"
                                    onClick={() => salvarOrdemServico()}
                                />

                                <Button
                                    text="Cancelar"
                                    type="danger"
                                    width={110}
                                    height={30}                                   
                                    className="m-3"
                                    icon='fas fa-arrow-left'
                                    stylingMode="contained"
                                    onClick={() => history.back()}
                                />
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

            <Popup
                width={660}
                height={540}
                showTitle={true}
                title={'titulo do modal'}
                dragEnabled={false}
                closeOnOutsideClick={true}
                visible={addCustoVisible}
                onHiding={() => { setAddCustoVisible(false) }}
                contentRender={() => {
                    return (<>
                        <form>
                            <div className="row">

                                <div className="form-group col-4">
                                    <label>Custo</label>
                                    <SelectBox
                                        dataSource={tipoCustos}
                                        displayExpr="descricao"
                                        searchEnabled={true}
                                        searchMode='contains'
                                        searchExpr='descricao'
                                        searchTimeout={200}
                                        minSearchLength={3}
                                        valueExpr='id'
                                        value={edtCusto.tipo_custo_id}
                                        showDataBeforeSearch={true}
                                        onValueChange={(value) => {
                                            setEdtCusto({ ...edtCusto, tipo_custo_id: value })
                                        }}
                                    />
                                </div>

                                <div className="form-group col-3">
                                    <label>Valor</label>
                                    <TextBox
                                        className="form-control"
                                        value={edtCusto.valor}
                                        onValueChange={(value) => {
                                            setEdtCusto({ ...edtCusto, valor: value })
                                        }}
                                    />
                                </div>

                                <div className="form-group col-3">
                                    <label>&nbsp;</label>
                                    <Button
                                        type="normal"
                                        text='Adicionar'
                                        icon='fas fa-plus'
                                        stylingMode="contained"
                                        onClick={() => {
                                            setAddCustoVisible(false);
                                            adicionarCusto();
                                        }}
                                    />
                                </div>



                            </div>
                        </form>
                    </>)
                }}                
            />

            <NotificationContainer />
        </>
    )
}
