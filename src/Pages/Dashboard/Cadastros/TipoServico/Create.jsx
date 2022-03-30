import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useParams  } from 'react-router-dom';
import { useEffect } from 'react';

import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import TipoServicoModel from '../../../../Models/TipoServico.ts';

export default function TipoServico() {
    
    const { tipo_servico_id } = useParams();

    let [tipoServico, setTipoServico] = useState(new TipoServicoModel()); 
    let [redirect, setRedirect] = useState(false);

    useEffect(function() {
        if (tipo_servico_id != null) {
            axios.get(`api/tipo-servicos/get/${tipo_servico_id}`)
                .then((response) => {
                    setTipoServico(response.data);
                })
                .catch((error) => {
                    console.log('error', error);
                });
        } 
    }, []);
    
    const handleChangeInput = function(e, attr){
        tipoServico[attr] = e.target.value;
        setTipoServico({ ...tipoServico });
    };

    const salvarTipoServico = function(e) {

        axios.post('api/tipo-servicos/createOrUpdate', tipoServico)
            .then((response) => {
    
                setRedirect(true);
    
            })
            .catch((error) => {
                console.log('error', error);
            });
    
    };

    if (redirect) {
        return <Navigate to="/app/tipo-servicos" />
    }

    return (
        <>           
            <Content titulo="Cadastro de Tipo de serviço">
                <div className="basic-form">
                    <form>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Descrição</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. Francisca Gutierrez" 
                                    value={tipoServico.descricao} 
                                    onChange={(e) => handleChangeInput(e, 'descricao') }
                                />
                            </div>                                                      
                        </div>

                        <button type="button" onClick={(e) => salvarTipoServico(e)} className="btn btn-sm btn-primary"> <i className="fas fa-check"></i>&nbsp;&nbsp;Salvar</button>
                        <button type="button" onClick={() => history.back() } className="btn btn-sm btn-info m-1"><i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Cancelar</button>

                    </form>
                </div>
            </Content>
        </>
    );

}
