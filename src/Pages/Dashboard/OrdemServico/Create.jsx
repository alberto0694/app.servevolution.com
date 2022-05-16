import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import DateBox from 'devextreme-react/date-box';
import withReactContent from 'sweetalert2-react-content';
import Popup from 'devextreme-react/popup';
import { TextArea } from 'devextreme-react/text-area';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import { NotificationManager } from 'react-notifications';
import { NumberBox } from 'devextreme-react/number-box';
import DataGrid, {
    Column,
    Lookup
} from 'devextreme-react/data-grid';
import List from 'devextreme-react/list';

import history from '../../../Componentes/History';
import OrdemServico from '../../../Models/OrdemServico';
import OrdemServicoCusto from '../../../Models/OrdemServicoCusto';
import Funcionario from '../../../Models/Funcionario';
import Content from '../../../Componentes/Content';
import Loading from '../../../Componentes/Loading';

export default function OrdemServicoCreate() {

    const { ordem_servico_id } = useParams();
    let swal = withReactContent(Swal);

    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [tipoCustos, setTipoCustos] = useState([]);
    const [tipoServicos, setTipoServicos] = useState([]);

    const [ordemServico, setOrdemServico] = useState(new OrdemServico());
    const [selectedFuncionario, setSelectedFuncionario] = useState(new Funcionario());
    const [focusedFuncionarios, setFocusedFuncionarios] = useState(new Funcionario());
    const [edtCusto, setEdtCusto] = useState(new OrdemServicoCusto());
    const [custosFocusedFuncionarios, setCustosFocusedFuncionarios] = useState([]);

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

        if (focusedFuncionarios.length == 1) {
            const c = ordemServico.custos.filter((custo) => {
                return custo.ordem_servico_funcionario.funcionario_id == focusedFuncionarios[0].id;
            });
            setCustosFocusedFuncionarios(c);
        } else {
            const c = ordemServico.custos.filter((custo) => {
                return focusedFuncionarios.map(f => f.id).includes(custo.ordem_servico_funcionario.funcionario_id);
            });
            setCustosFocusedFuncionarios(c);
        }

    }, [focusedFuncionarios]);

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
                if(response.data.status === false){
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
                if(response.data.status === false){
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
                if(response.data.status === false){
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
                if(response.data.status === false){
                    NotificationManager.error(response.data.message, 'Ordem de Serviço');
                } else {
                    setRedirect(true);
                }            
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Ordem de Serviço');
            });

    };

    const adicionarFuncionario = () => {
        ordemServico.funcionarios = [...ordemServico.funcionarios, selectedFuncionario];
        setOrdemServico({ ...ordemServico });
        setSelectedFuncionario(new Funcionario());
    }

    const removerFuncionario = () => {

        swal.fire({
            title: 'Retirar funcionário',
            text: `Deseja realmente retirar ${focusedFuncionarios[0].pessoa.razao || focusedFuncionarios[0].pessoa.apelido} desta ordem de serviço?`,
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
            .then((response) => {

                if (response.isConfirmed) {

                    if (ordemServico.id && focusedFuncionarios[0].id) {
                        axios.post(`api/ordem-servicos/funcionario/delete/${ordemServico.id}/${focusedFuncionarios[0].id}`, ordemServico)
                            .then((response) => {
                                setOrdemServico(response.data);
                                NotificationManager.success('Funcionário removido', 'Funcionário');
                            })
                            .catch((error) => {
                                NotificationManager.error(JSON.stringify(error), 'Erro ao excluir');
                            });
                    } else {
                        
                    }

                }
            });
    }

    const adicionarCusto = () => {    
        ordemServico.custos = [...ordemServico.custos, edtCusto];
        setOrdemServico({ ...ordemServico });
        setEdtCusto(new OrdemServicoCusto());
        setFocusedFuncionarios([...focusedFuncionarios]);
    }

    const openAddCusto = () => {

        if (focusedFuncionarios.length == 1) {
            edtCusto.ordem_servico_funcionario.funcionario_id = focusedFuncionarios[0].id;
            setEdtCusto({ ...edtCusto });
            setAddCustoVisible(true);
        } else {
            NotificationManager.warning('Selecione somente um funcionário!', "Verifique");
        }
    }

    const renderGrid = () => {

        return (
            <>
                <DataGrid
                    className='border-list'
                    dataSource={custosFocusedFuncionarios}
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
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>                                    
                                </>
                            );
                        }}

                    />
                </DataGrid>
            </>
        );
    }

    const renderPopEditCusto = () => {

        if(focusedFuncionarios.length != 1) return <></>;

        return (
            <>
                <Popup
                    width={660}
                    height={540}
                    showTitle={true}
                    title={'Custos de Funcionário'}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    visible={addCustoVisible}
                    onHiding={() => { 
                        setAddCustoVisible(false) 
                    }}
                    contentRender={() => {
                        return (
                        <>
                            <form>
                                <div className="row">

                                    <div className="form-group col-12">
                                        <div className="read-content">
                                            <div className="media pt-3 d-sm-flex d-block justify-content-between">
                                                <div className="clearfix d-flex">
                                                    <img className="me-3 rounded" width="70" height="70" alt="image" src={focusedFuncionarios[0].pessoa.foto ?? "images/contacts/user.jpg"} />
                                                    <div className="media-body me-2">
                                                        <h5 className="text-primary mb-0 mt-1">{focusedFuncionarios[0].pessoa.razao || focusedFuncionarios[0].pessoa.apelido}</h5>
                                                        <p className="mb-0">{focusedFuncionarios[0].pessoa.contatoImediato}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group col-7">
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
                                        <NumberBox
                                            className="form-control"
                                            defaultValue={0}
                                            showSpinButtons={true}
                                            value={edtCusto.valor}
                                            format={{                                           
                                                style: "currency", 
                                                currency: "BRL"
                                            }}
                                            onValueChange={(value) => {
                                                setEdtCusto({ ...edtCusto, valor: value })
                                            }}
                                        />                                        
                                    </div>

                                    <div className="form-group col-2">
                                        <label>&nbsp;</label>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setAddCustoVisible(false);
                                                    adicionarCusto();
                                                }}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
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

    const renderPage = () => {

        if (showLoader) {

            return <Loading />

        } else {

            return (
                <>
                    <form>
                        <div className="row">
                            <div className="form-group col-3">
                                <label>Data</label>
                                <DateBox 
                                    defaultValue={new Date()}
                                    value={ordemServico.data}
                                    showClearButton={true}
                                    displayFormat="dd/MM/yyyy" 
                                    onValueChange={(value) => handleChange(value, 'data')}
                                />
                            </div>
                            <div className="form-group col-2">
                                <label>Hora</label>
                                <DateBox 
                                    type="time"
                                    defaultValue={new Date()}
                                    value={ordemServico.hora}
                                    showClearButton={true}
                                    displayFormat="HH:mm" 
                                    onValueChange={(value) => handleChange(value, 'hora')}
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
                                    onValueChange={(value) => handleChange(value, 'tipo_servico_id')}
                                />
                            </div>

                            <div className="form-group col-4">
                                <label>Cliente</label>
                                <SelectBox
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
                                <div className="form-group row mb-7px">
                                    <label>Escolha um funcionário para adicionar</label>
                                    <div className="col-10">
                                        <SelectBox
                                            dataSource={funcionarios}
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
                                            value={selectedFuncionario.id}
                                            onValueChange={(value) => {
                                                const func = funcionarios.find(f => f.id == value);
                                                setSelectedFuncionario(func);
                                            }}
                                        />
                                    </div>

                                    <div className="col-1 p-0">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={adicionarFuncionario}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group border-list">                                    
                                    <List
                                        dataSource={ordemServico.funcionarios}
                                        selectionMode="all"
                                        className="m-0"
                                        showSelectionControls={true}
                                        style={{ background: 'white' }}
                                        itemRender={(funcionario) => {
                                            return funcionario.pessoa.razao || funcionario.pessoa.apelido;
                                        }}
                                        valueExpr='id'
                                        onOptionChanged={(e) => {                                            
                                            if(e.name == "selectedItemKeys"){
                                                setFocusedFuncionarios(e.value);                                                
                                            }
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
                                                        <img className="me-3 rounded" width="70" height="70" alt="image" src={focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.foto ?? "images/contacts/user.jpg" : "images/contacts/user.jpg"} />
                                                        <div className="media-body me-2">
                                                            <h5 className="text-primary mb-0 mt-1">{focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.razao || focusedFuncionarios[0].pessoa.apelido : `${focusedFuncionarios.length} funcionários selecionados`}</h5>
                                                            <p className="mb-0">{focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.contatoImediato : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix">
                                                        <Button
                                                            type="danger"
                                                            visible={Boolean(focusedFuncionarios.length == 1)}
                                                            icon='fas fa-trash'
                                                            stylingMode="contained"
                                                            onClick={() => removerFuncionario() }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="media mb-2 mt-2">

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
                                <div className="d-flex justify-end">
                                    <Button
                                        text="Salvar"
                                        type="success"
                                        icon='fas fa-save'
                                        stylingMode="contained"
                                        onClick={() => salvarOrdemServico()}
                                    />

                                    <Button
                                        text="Cancelar"
                                        type="danger"
                                        className="ml-1"
                                        icon='fas fa-arrow-left'
                                        stylingMode="contained"
                                        onClick={() => history.back()}
                                    />
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

            {renderPopEditCusto()}
        </>
    )
}
