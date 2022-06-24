import React, { useState, useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import TagBox from 'devextreme-react/tag-box';
import List from 'devextreme-react/list';
import Popup from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';
import { NumberBox } from 'devextreme-react/number-box';
import Swal from 'sweetalert2';
import { Button } from 'devextreme-react/button';

import OrdemServicoCusto from '../../../../Models/OrdemServicoCusto';
import GridFuncionariosCustos from './GridFuncionariosCustos';

export default function TabFuncionario(props) {

    let swal = withReactContent(Swal);
    const [selectedFuncionarios, setSelectedFuncionarios] = useState([]);
    const [focusedFuncionarios, setFocusedFuncionarios] = useState([]);
    const [edtCusto, setEdtCusto] = useState(null);
    const [focusedCustos, setFocusedCustos] = useState([]);
    const [addCustoVisible, setAddCustoVisible] = useState(false);

    const {
        ordemServico,
        funcionarios,
        tipoCustos,
        cbSetFuncionarios,
        cbSetCustos
    } = props;

    useEffect((e) => {

        console.log('focusedFuncionarios', focusedFuncionarios);
        const c = ordemServico.custos.filter((custo) => {
            return focusedFuncionarios?.map(f => f.id).includes(custo.ordem_servico_funcionario.funcionario_id);
        });
        setFocusedCustos(c);

    }, [focusedFuncionarios]);

    const openAddCusto = () => {

        if (focusedFuncionarios.length > 0) {
            setEdtCusto(new OrdemServicoCusto());
            setAddCustoVisible(true);
        } else {
            NotificationManager.warning('Selecione ao menos um funcionário!', "Verifique");
        }
    }

    const removerFuncionario = () => {

        const title = focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.normalized_name : `esse ${focusedFuncionarios.length} funcionários`
        swal.fire({
            title: 'Retirar funcionário',
            text: `Deseja realmente retirar ${title} desta ordem de serviço?`,
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
            .then((response) => {

                if (response.isConfirmed) {

                    if (ordemServico.id && focusedFuncionarios.length > 0) {
                        axios.post(`api/ordem-servicos/funcionario/delete/${ordemServico.id}`,{
                            funcionarios_id: focusedFuncionarios.map(f => f.id)
                        })
                            .then((response) => {
                                cbSetFuncionarios(response.data);
                                NotificationManager.success('Funcionário(s) removido(s) com sucesso.', 'Funcionário');
                            })
                            .catch((error) => {
                                NotificationManager.error(JSON.stringify(error), 'Erro ao excluir');
                            });
                    } else {

                    }

                }

            });
    }

    const removerCusto = (e, { data }) =>{

        swal.fire({
            title: 'Remover Custo',
            text: `Deseja realmente remover este custo?`,
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
            .then((response) => {

                if (response.isConfirmed) {

                    const funcs_sel_ids = focusedFuncionarios.map(f => f.id);
                    const custos = ordemServico.custos.filter((c) => {
                        return funcs_sel_ids.indexOf(c.ordem_servico_funcionario.funcionario_id) > -1
                                && c.tipo_custo_id == data.tipo_custo_id;                        
                    });


                    console.log('data', data);

                }

            });
    }

    const adicionarFuncionario = () => {
        const osf_ids = ordemServico.funcionarios.map(f => f.id);
        const sel_funcs = selectedFuncionarios.filter(f => osf_ids.indexOf(f.id) == -1);
        const funcs = [...sel_funcs, ...ordemServico.funcionarios];
        cbSetFuncionarios(funcs);
        setSelectedFuncionarios([]);
    }

    const adicionarCusto = () => {
        const arr_custos = focusedFuncionarios.map((func) => {
            return {
                ...edtCusto,
                ordem_servico_funcionario: {
                    ...edtCusto.ordem_servico_funcionario,
                    funcionario_id: func.id
                }
            };
        })

        const custos = [...ordemServico.custos, ...arr_custos];
        cbSetCustos(custos);
        setEdtCusto(new OrdemServicoCusto());
        setFocusedFuncionarios([...focusedFuncionarios]);
    }

    const renderPopEditCusto = () => {

        if (focusedFuncionarios.length == 0) return <></>;

        return (
            <>
                <Popup
                    width={700}
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
                                                    {renderHeaderFuncionario()}
                                                </div>

                                                <GridFuncionariosCustos
                                                    custos={focusedCustos}
                                                    tipoCustos={tipoCustos}
                                                />

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

                                        <div className="form-group col-2 p-0">
                                            <label>&nbsp;</label>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm p-2"
                                                    onClick={() => {                                                        
                                                        adicionarCusto();
                                                    }}
                                                >
                                                    <i className="fas fa-plus"></i> Adicionar
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

    const renderHeaderFuncionario = () => {
        return (
            <>
                <div className="clearfix d-flex">
                    <img className="me-3 rounded" width="70" height="70" alt="image" src={focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.foto ?? "images/contacts/user.jpg" : "images/contacts/user.jpg"} />
                    <div className="media-body me-2">
                        <h5 className="text-primary mb-0 mt-1">{focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.normalized_name : `${focusedFuncionarios.length} funcionários selecionados`}</h5>
                        <p className="mb-0">{focusedFuncionarios.length == 1 ? focusedFuncionarios[0].pessoa.contatoImediato : ''}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="row">
                <div className="m-0 col-5">
                    <div className="form-group row mb-7px">
                        <label>Escolha um funcionário para adicionar</label>

                        <div className="row">
                            <div className="col-10">

                                <TagBox
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

                            <div className="col-2 p-0">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm p-2"
                                    onClick={adicionarFuncionario}
                                >
                                    <i className="fas fa-plus"></i> Adicionar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group border-list">
                        <List
                            dataSource={ordemServico.funcionarios}
                            selectionMode="all"
                            className="m-0"
                            showSelectionControls={true}
                            style={{ background: 'white' }}
                            displayExpr={'pessoa.normalized_name'}
                            valueExpr='id'
                            onOptionChanged={(e) => {
                                if (e.name == "selectedItemKeys") {
                                    const ids = e.value.map(f => f.id);                                    
                                    const funcs = ordemServico.funcionarios.filter(f => ids.indexOf(f.id) > -1);                                    
                                    setFocusedFuncionarios(funcs);
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

                                        {renderHeaderFuncionario()}

                                        <div className="clearfix">
                                            <Button
                                                type="danger"
                                                visible={Boolean(focusedFuncionarios.length > 0)}
                                                icon='fas fa-trash'
                                                stylingMode="contained"
                                                onClick={() => removerFuncionario()}
                                            />
                                        </div>
                                    </div>
                                    <div className="media mb-2 mt-2">

                                        <GridFuncionariosCustos
                                            custos={focusedCustos}
                                            tipoCustos={tipoCustos}
                                            onRemoveCusto={removerCusto}
                                        />

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
            </div>

            {renderPopEditCusto()}

        </>
    )
}