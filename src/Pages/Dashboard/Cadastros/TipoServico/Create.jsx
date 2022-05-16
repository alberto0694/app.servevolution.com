import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { NotificationManager } from 'react-notifications';

import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import TipoServicoModel from '../../../../Models/TipoServico.ts';
import Loading from '../../../../Componentes/Loading';

export default function TipoServico() {

    const { tipo_servico_id } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    let [tipoServico, setTipoServico] = useState(new TipoServicoModel());
    let [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (tipo_servico_id != null) {
            setShowLoader(true);
            axios.get(`api/tipo-servicos/get/${tipo_servico_id}`)
                .then((response) => {                    
                    setTipoServico(response.data);
                    setShowLoader(false);
                })
                .catch((error) => {
                    setShowLoader(false);
                    NotificationManager.error(JSON.stringify(error), 'Tipo de Serviço');
                });
        }
    }, []);

    const handleChangeInput = (e, attr) => {
        tipoServico[attr] = e.value;
        setTipoServico({ ...tipoServico });
    };

    const salvarTipoServico = (e) => {
        setShowLoader(true);
        axios.post('api/tipo-servicos/createOrUpdate', tipoServico)
            .then((response) => {
                setRedirect(true);
                setShowLoader(false);
                NotificationManager.success('Tipo de serviço salvo com sucesso.', 'Tipo de Serviço');
            })
            .catch((error) => {
                setShowLoader(false);
                NotificationManager.error(JSON.stringify(error), 'Tipo de Serviço');
            });

    };

    const renderPage = () => {
        if (showLoader) {
            return <Loading />
        }

        return (
            <>
                <form>
                    <div className="row">
                        <div className="form-group mb-3 col-6">
                            <label className="form-label">Tipo de Serviço</label>
                            <TextBox
                                value={tipoServico.descricao}
                                onValueChanged={(e) => handleChangeInput(e, 'descricao')}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-end">
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
                            onClick={(e) => salvarTipoServico(e)}
                        />
                    </div>
                </form>
            </>
        );
    }

    if (redirect) {
        return <Navigate to="/app/tipo-servicos" />
    }

    return (
        <>
            <Content titulo="Cadastro de Tipo de serviço">
                {renderPage()}
            </Content>
        </>
    );

}
