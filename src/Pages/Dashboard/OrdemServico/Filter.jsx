import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import TagBox from 'devextreme-react/tag-box';
import DateBox from 'devextreme-react/date-box';
import { Button } from 'devextreme-react/button';


const filterDataInit = {
    dataInicial: null,
    dataFinal: null,
    servicos: [],
    funcionarios: []
};

export default function Filter({callbackFilter}) {
    
    const [funcionarios, setFuncionarios] = useState([]);
    const [tipoServicos, setTipoServicos] = useState([]);
    const [filterData, setFilterData] = useState(filterDataInit);

    useEffect(() => {
        getFuncionarios();
        getTipoServicos();
    }, []);

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

    const renderFuncionarioItem = (funcionario) => {
        return (
            <>
                <img className="rounded-circle" width="35" src={funcionario.pessoa?.foto || "images/contacts/user.jpg"} alt="" />
                <span>&nbsp;{funcionario.pessoa?.razao || funcionario.pessoa?.apelido}</span>
            </>
        )
    }


    return (
        <>
            <div className="project-nav justify-content-start">
                <div className="form-group col-2">
                    <label>Data Inicial</label>
                    <DateBox
                        defaultValue={new Date()}
                        value={filterData.dataInicial}
                        showClearButton={true}
                        displayFormat="dd/MM/yyyy"
                        onValueChanged={(item) => {
                            setFilterData({...filterData, dataInicial: item.value})
                        }}
                    />
                </div>
                <div className="form-group col-2 ml-1">
                    <label>Data Final</label>
                    <DateBox
                        defaultValue={new Date()}
                        value={filterData.dataFinal}
                        showClearButton={true}
                        displayFormat="dd/MM/yyyy"
                        onValueChanged={(item) => {
                            setFilterData({...filterData, dataFinal: item.value})
                        }}
                    />
                </div>
                <div className="form-group col-3 ml-1">
                    <label>Serviços</label>
                    <TagBox
                        searchEnabled={true}
                        showClearButton={true}
                        dataSource={tipoServicos}
                        displayExpr="descricao"
                        valueExpr="id"
                        selectedItems={filterData.servicos}
                        onValueChanged={(item) => {
                            setFilterData({...filterData, servicos: item.value})
                        }}
                    />
                </div>
                <div className="form-group col-3 ml-1">
                    <label>Funcionários</label>
                    <TagBox
                        searchEnabled={true}
                        showClearButton={true}
                        dataSource={funcionarios}
                        itemRender={renderFuncionarioItem}
                        displayExpr={(item) => {
                            return item?.pessoa.razao || item?.pessoa.apelido
                        }}
                        valueExpr="id"
                        selectedItems={filterData.funcionarios}
                        onValueChanged={(item) => {
                            setFilterData({...filterData, funcionarios: item.value})
                        }}
                    />
                </div>
                <div className="form-group col-1 ml-1">
                    <label className='w-full'>&nbsp;</label>
                    <Button
                        text='Procurar'
                        type='normal'
                        icon='fas fa-search'
                        stylingMode="contained"
                        onClick={() => callbackFilter(filterData)}
                    />
                </div>
            </div>
        </>
    )
}
