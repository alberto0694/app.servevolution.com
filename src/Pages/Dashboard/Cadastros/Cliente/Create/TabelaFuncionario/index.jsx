import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import List from 'devextreme-react/list';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import TextArea from 'devextreme-react/text-area';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
} from 'devextreme-react/data-grid';
import Popup from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';

import Loading from '../../../../../../Componentes/Loading';
import ValorFuncionario from '../../../../../../Models/ValorFuncionario';

export default function Index({ cliente, setCliente, tipoServicos, unidadesMedidas }) {

    let swal = withReactContent(Swal);
    const [showModalFuncionario, setShowModalFuncionario] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [valorFuncionario, setValorFuncionario] = useState(null);
    const [openingValorFuncionario, setOpeningValorFuncionario] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionarios, setSelectedFuncionarios] = useState([]);
    const [focusedFuncionarios, setFocusedFuncionarios] = useState([]);
    const [editFuncionario, setEditFuncionario] = useState(false);

    useEffect(() => {
        const funcs = cliente.valores_funcionarios.map((vf) => vf.funcionario);
        let arr_ids = [];
        const funcs_normalized = funcs.filter((f) => {
            if(!arr_ids.includes(f.id)){
                arr_ids.push(f.id);
                return true;
            }

            return false;
        })

        setFuncionarios(funcs_normalized);

    }, []);


    useEffect(() => {
        
        if (!valorFuncionario) return;

        if (!valorFuncionario?.cliente_id) {
            NotificationManager.warning('Salve primeiro este cliente para poder adicionar um valor à este funcionário.', 'Tabela de Preço');
            return;
        }

        setShowModalFuncionario(true);

    }, [valorFuncionario]);

    const getFuncionarios = (tipo_servico_id) => {
        const query_param = tipo_servico_id ? `?tipo_servico_id=${tipo_servico_id}` : '';
        axios.get(`api/funcionario/list${query_param}`)
            .then((response) => {
                if (response.data.status === false) {
                    NotificationManager.error(response.data.message, 'Funcionário');
                } else {
                    setFuncionarios(response.data);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Funcionário');
            });
    };

    const adicionarValorFuncionario = () => {
        setOpeningValorFuncionario(true);
        setValorFuncionario({ ...new ValorFuncionario(), cliente_id: cliente.id });
        setFocusedFuncionarios([]);
        setSelectedFuncionarios([]);
    }
    
    const adicionarFuncionario = () => {
        const osf_ids = focusedFuncionarios.map(f => f.id);
        const sel_funcs = selectedFuncionarios.filter(f => osf_ids.indexOf(f.id) == -1);
        const funcs = [...sel_funcs, ...focusedFuncionarios];
        setFocusedFuncionarios(funcs);
        setSelectedFuncionarios([]);
    }

    const editarValorFuncionario = (data) => {     
        setOpeningValorFuncionario(true);
        setValorFuncionario({ ...data });

        const funcs = funcionarios.filter((f) => f.id == data.funcionario_id);
        setFocusedFuncionarios(funcs);
        setEditFuncionario(true);
    }

    const salvarValorFuncionario = (data) => {
        setShowLoader(true);

        const valoresFuncionarios = focusedFuncionarios.map(({ id }) => {
            return {
                ...valorFuncionario,
                funcionario_id: id
            }
        });

        axios.post(`api/clientes/valor-funcionario/createOrUpdate?cliente_id=${cliente.id}`, valoresFuncionarios)
            .then((response) => {
                setShowModalFuncionario(false);
                setShowLoader(false);
                setCliente({ ...cliente, valores_funcionarios: response.data });
                NotificationManager.success('Valor do funcionário salvo com sucesso.', 'Tabela de Preço');
            })
            .catch((error) => {
                setShowLoader(false);
                NotificationManager.error(JSON.stringify(error), 'Tabela de Preço');
            });
    }

    const excluirValorFuncionario = (data) => {
        swal.fire({
            title: 'Exclusão de Funcionário no Cliente',
            text: 'Deseja realmente excluir este funcionário deste cliente?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
            .then((response) => {

                if (response.isConfirmed) {
                    setShowLoader(true);
                    axios.post(`api/clientes/valor-funcionario/delete?cliente_id=${data.cliente_id}`, [data.id])
                        .then((response) => {
                            setCliente({ ...cliente, valores_funcionarios: response.data });
                            setShowLoader(false);
                            NotificationManager.success('Funcionário excluído com sucesso!', 'Funcionário');
                        })
                        .catch((error) => {
                            setShowLoader(false);
                            NotificationManager.error(JSON.stringify(error), 'Funcionário');
                        });

                }
            });
    }

    const renderModalFuncionario = () => {

        return (
            <>
                <Popup
                    width={780}
                    height={500}
                    showTitle={true}
                    title={'Adicionar Funcionário'}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    visible={showModalFuncionario}
                    onHiding={() => {
                        setShowModalFuncionario(false);
                        setFocusedFuncionarios([]);
                        setSelectedFuncionarios([]);
                    }}
                    onShown={() => setOpeningValorFuncionario(false)}
                    contentRender={() => {

                        return (
                            <>
                                <form>
                                    <div className="row">

                                        <div className="form-grop col-6">
                                            <div className="form-group col-12">
                                                <label>Tipo de Serviço</label>
                                                <SelectBox
                                                    dataSource={tipoServicos}
                                                    displayExpr='descricao'
                                                    searchEnabled={true}
                                                    searchMode='contains'
                                                    searchExpr={'descricao'}
                                                    searchTimeout={200}
                                                    minSearchLength={3}
                                                    showDataBeforeSearch={true}
                                                    valueExpr='id'
                                                    value={valorFuncionario.tipo_servico_id}
                                                    onValueChanged={(data) => {
                                                        if (openingValorFuncionario) return;
                                                        setValorFuncionario({ ...valorFuncionario, tipo_servico_id: data.value });
                                                        getFuncionarios(data.value);
                                                    }}
                                                />
                                            </div>

                                            <div className="form-group col-12">
                                                <label>Valor</label>
                                                <NumberBox
                                                    className="form-control"
                                                    format={{
                                                        type: "currency",
                                                        precision: 2
                                                    }}
                                                    value={valorFuncionario.valor}
                                                    onValueChanged={(data) => {
                                                        if (openingValorFuncionario) return;
                                                        setValorFuncionario({ ...valorFuncionario, valor: data.value });
                                                    }}
                                                />
                                            </div>

                                            <div className="form-group col-12">
                                                <label>Como será pago</label>
                                                <SelectBox
                                                    dataSource={unidadesMedidas}
                                                    displayExpr='descricao'
                                                    searchEnabled={true}
                                                    searchMode='contains'
                                                    searchExpr={'descricao'}
                                                    searchTimeout={200}
                                                    minSearchLength={3}
                                                    showDataBeforeSearch={true}
                                                    valueExpr='id'
                                                    value={valorFuncionario.unidade_medida_id}
                                                    onValueChanged={(data) => {
                                                        if (openingValorFuncionario) return;
                                                        setValorFuncionario({ ...valorFuncionario, unidade_medida_id: data.value });
                                                    }}
                                                />
                                            </div>
                                            
                                        </div>

                                        <div className="form-group col-6">
                                            <div className="form-group row mb-7px">
                                                <label>Escolha um funcionário para adicionar</label>

                                                <div className="row">
                                                    <div className="col-11">

                                                        <TagBox
                                                            disabled={editFuncionario}
                                                            items={funcionarios}
                                                            showSelectionControls={true}
                                                            applyValueMode="useButtons"
                                                            displayExpr='pessoa.normalized_name'
                                                            valueExpr='id'
                                                            searchEnabled={true}
                                                            searchMode='contains'
                                                            onValueChange={(data) => {
                                                                const funcs = funcionarios.filter(f => data.indexOf(f.id) > -1);
                                                                setSelectedFuncionarios(funcs);
                                                            }}
                                                            value={selectedFuncionarios.map(f => f.id)}
                                                        />
                                                    </div>

                                                    <div className="col-1 p-0">
                                                        <button
                                                            disabled={editFuncionario}
                                                            type="button"
                                                            className="btn btn-primary btn-sm p-2"
                                                            onClick={adicionarFuncionario}
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group border-list">
                                                <List
                                                    disabled={editFuncionario}
                                                    dataSource={focusedFuncionarios}
                                                    selectionMode="all"
                                                    className="m-0"
                                                    showSelectionControls={true}
                                                    style={{ background: 'white' }}
                                                    displayExpr={'pessoa.normalized_name'}
                                                    valueExpr='id'
                                                    onOptionChanged={(e) => {
                                                        if (e.name == "selectedItemKeys") {
                                                            const ids = e.value.map(f => f.id);                                    
                                                            // const funcs = ordemServico.funcionarios.filter(f => ids.indexOf(f.id) > -1);                                    
                                                            // setFocusedFuncionarios(funcs);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>                                        

                                        <div className="form-group col-12 mt-3">
                                            <div className="d-flex justify-end">
                                                <Button
                                                    text="Cancelar"
                                                    type="normal"
                                                    icon='fas fa-arrow-left'
                                                    stylingMode="contained"
                                                    onClick={() => {
                                                        setEditFuncionario(true);
                                                        setShowModalFuncionario(false);
                                                    }}
                                                />

                                                <Button
                                                    text="Salvar"
                                                    type="success"
                                                    className="ml-1"
                                                    icon='fas fa-save'
                                                    stylingMode="contained"
                                                    onClick={() => {
                                                        setEditFuncionario(true);
                                                        salvarValorFuncionario();
                                                    }}
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

    if (showLoader) {
        return <Loading />
    }

    return (
        <>
            <div className="mt-4">
                <div className="d-flex justify-start">
                    <Button
                        text="Adicionar funcionário"
                        type="normal"
                        icon='fas fa-plus'
                        stylingMode="contained"
                        onClick={adicionarValorFuncionario}
                    />
                </div>

                <DataGrid
                    dataSource={cliente.valores_funcionarios}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                >
                    <GroupPanel visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Grouping autoExpandAll={false} />

                    <Column
                        caption="Funcionário"
                        dataField="funcionario.pessoa.normalized_name"
                        dataType="string"
                        defaultSortOrder="asc"
                    />

                    <Column
                        caption="Tipo de Serviço"
                        dataField="tipo_servico.descricao"
                        dataType="string"
                        defaultSortOrder="asc"
                    />

                    <Column
                        caption="Valor"
                        dataField="valor"
                        dataType="number"
                        format={{
                            style: 'currency',
                            precision: 2,
                            currency: 'BRL'
                        }}
                    />

                    <Column
                        caption="Cobrança relizada por"
                        dataField="unidade_medida.descricao"
                        dataType="string"
                    />

                    <Column
                        alignment="center"
                        caption="Ações"
                        width={120}
                        cellRender={(cellData) => {
                            const { data } = cellData;
                            return (
                                <>
                                    <div className="d-flex justify-center">
                                        <Button
                                            type="normal"
                                            icon='fas fa-pencil-alt'
                                            onClick={() => editarValorFuncionario(data)}
                                        />
                                        <Button
                                            className='ml-1'
                                            type="normal"
                                            icon='fas fa-trash'
                                            onClick={(e) => excluirValorFuncionario(data)}
                                        />
                                    </div>
                                </>
                            )
                        }}
                    />

                    <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={false} />
                    <Paging defaultPageSize={10} />
                </DataGrid>

            </div>
            {renderModalFuncionario()}
        </>
    )
}
