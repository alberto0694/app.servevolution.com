import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { NotificationManager } from 'react-notifications';

import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import TipoCustoModel from '../../../../Models/TipoCusto.ts';
import Loading from '../../../../Componentes/Loading';

export default function TipoCusto() {

    const { tipo_custo_id } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    let [tipoCusto, setTipoCusto] = useState(new TipoCustoModel());
    let [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (tipo_custo_id != null) {
            setShowLoader(true);
            axios.get(`api/tipo-custos/get/${tipo_custo_id}`)
                .then((response) => {                    
                    setTipoCusto(response.data);
                    setShowLoader(false);
                })
                .catch((error) => {
                    setShowLoader(false);
                    NotificationManager.error(JSON.stringify(error), 'Tipo de Serviço');
                });
        }
    }, []);

    const handleChangeInput = (e, attr) => {
        tipoCusto[attr] = e.value;
        setTipoCusto({ ...tipoCusto });
    };

    const salvarTipoCusto = (e) => {
        setShowLoader(true);
        axios.post('api/tipo-custos/createOrUpdate', tipoCusto)
            .then((response) => {
                setRedirect(true);
                setShowLoader(false);
                NotificationManager.success('Tipo de custo salvo com sucesso.', 'Tipo de Serviço');
            })
            .catch((error) => {
                setShowLoader(false);
                NotificationManager.error(JSON.stringify(error), 'Tipo de Custo');
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
                            <label className="form-label">Tipo de Custo</label>
                            <TextBox
                                value={tipoCusto.descricao}
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
                            onClick={(e) => salvarTipoCusto(e)}
                        />
                    </div>
                </form>
            </>
        );
    }

    if (redirect) {
        return <Navigate to="/app/tipo-custos" />
    }

    return (
        <>
            <Content titulo="Cadastro de Tipo de custo">
                {renderPage()}
            </Content>
        </>
    );

}
