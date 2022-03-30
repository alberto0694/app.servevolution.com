import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useParams  } from 'react-router-dom';
import { useEffect } from 'react';

import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import FuncionarioModel from '../../../../Models/Funcionario.ts';

export default function FuncionarioCreate() {
    
    const { funcionario_id } = useParams();

    let [funcionario, setFuncionario] = useState(new FuncionarioModel()); 
    let [redirect, setRedirect] = useState(false);

    useEffect(function() {
        if (funcionario_id != null) {
            axios.get(`api/funcionario/get/${funcionario_id}`)
                .then((response) => {
                    setFuncionario(response.data);
                })
                .catch((error) => {
                    console.log('error', error);
                });
        } 
    }, []);
    
    const handleChangeInput = function(e, attr){
        funcionario.pessoa[attr] = e.target.value;
        setFuncionario({ ...funcionario });
    };

    const salvarFuncionario = function(e) {

        axios.post('api/funcionario/createOrUpdate', funcionario)
            .then((response) => {
    
                setRedirect(true);
    
            })
            .catch((error) => {
                console.log('error', error);
            });
    
    };

    if (redirect) {
        return <Navigate to="/app/funcionarios" />
    }

    return (
        <>           
            <Content titulo="Cadastro de Funcionários">
                <div className="basic-form">
                    <form>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Nome do funcionário</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. Francisca Gutierrez" 
                                    value={funcionario.pessoa.razao} 
                                    onChange={(e) => handleChangeInput(e, 'razao') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Contato Imediato</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. (47) 999900000" 
                                    value={funcionario.pessoa.contatoImediato} 
                                    onChange={(e) => handleChangeInput(e, 'contatoImediato') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Apelido</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. Lorem Ipsum" 
                                    value={funcionario.pessoa.apelido} 
                                    onChange={(e) => handleChangeInput(e, 'apelido') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Telefone</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. (47) 999900000" 
                                    value={funcionario.pessoa.telefone} 
                                    onChange={(e) => handleChangeInput(e, 'telefone') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Email</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. (47) 999900000" 
                                    value={funcionario.pessoa.email} 
                                    onChange={(e) => handleChangeInput(e, 'email') }
                                />
                            </div>                            
                        </div>

                        <button type="button" onClick={(e) => salvarFuncionario(e)} className="btn btn-sm btn-primary"> <i className="fas fa-check"></i>&nbsp;&nbsp;  Salvar</button>
                        <button type="button" onClick={() => history.back() } className="btn btn-sm btn-info m-1"><i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Cancelar</button>

                    </form>
                </div>
            </Content>
        </>
    );

}
