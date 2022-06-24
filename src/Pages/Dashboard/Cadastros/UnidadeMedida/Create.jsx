import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { NotificationManager } from 'react-notifications';

import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import UnidadeMedidaModel from '../../../../Models/UnidadeMedida.ts';
import Loading from '../../../../Componentes/Loading';

export default function UnidadeMedida() {

    const { unidade_medida_id } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    let [unidadeMedida, setUnidadeMedida] = useState(new UnidadeMedidaModel());
    let [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (unidade_medida_id != null) {
            setShowLoader(true);
            axios.get(`api/unidade-medida/get/${unidade_medida_id}`)
                .then((response) => {                    
                    setUnidadeMedida(response.data);
                    setShowLoader(false);
                })
                .catch((error) => {
                    setShowLoader(false);
                    NotificationManager.error(JSON.stringify(error), 'Unidade de Medida');
                });
        }
    }, []);

    const handleChangeInput = (e, attr) => {
        unidadeMedida[attr] = e.value;
        setUnidadeMedida({ ...unidadeMedida });
    };

    const salvarUnidadeMedida = (e) => {
        setShowLoader(true);
        axios.post('api/unidade-medida/createOrUpdate', unidadeMedida)
            .then((response) => {
                setRedirect(true);
                setShowLoader(false);
                NotificationManager.success('Unidade de Medida salvo com sucesso.', 'Unidade de Medida');
            })
            .catch((error) => {
                setShowLoader(false);
                NotificationManager.error(JSON.stringify(error), 'Unidade de Medida');
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
                            <label className="form-label">Unidade de Medida</label>
                            <TextBox
                                value={unidadeMedida.descricao}
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
                            onClick={(e) => salvarUnidadeMedida(e)}
                        />
                    </div>
                </form>
            </>
        );
    }

    if (redirect) {
        return <Navigate to="/app/unidade-medida" />
    }

    return (
        <>
            <Content titulo="Cadastro de Unidade de Medida">
                {renderPage()}
            </Content>
        </>
    );

}
