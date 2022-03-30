import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useParams  } from 'react-router-dom';
import { useEffect } from 'react';

import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import ClienteModel from '../../../../Models/Cliente.ts';

export default function ClienteCreate() {
    
    const { cliente_id } = useParams();

    let [cliente, setCliente] = useState(new ClienteModel()); 
    let [redirect, setRedirect] = useState(false);

    useEffect(function() {
        if (cliente_id != null) {
            axios.get(`api/clientes/get/${cliente_id}`)
                .then((response) => {
                    setCliente(response.data);
                })
                .catch((error) => {
                    console.log('error', error);
                });
        } 
    }, []);
    
    const handleChangeInput = function(e, attr){
        cliente.pessoa[attr] = e.target.value;
        setCliente({ ...cliente });
    };

    const handleChangeSenha = function(e){
        cliente.senha = e.target.value;
        setCliente({ ...cliente });
    };

    const salvarCliente = function(e) {

        axios.post('api/clientes/createOrUpdate', cliente)
            .then((response) => {
    
                setRedirect(true);
    
            })
            .catch((error) => {
                console.log('error', error);
            });
    
    };

    if (redirect) {
        return <Navigate to="/app/clientes" />
    }

    return (
        <>           
            <Content titulo="Cadastro de Cliente">
                <div className="basic-form">
                    <form>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Nome do Cliente</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. Francisca Gutierrez" 
                                    value={cliente.pessoa.razao} 
                                    onChange={(e) => handleChangeInput(e, 'razao') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Contato Imediato</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. (47) 999900000" 
                                    value={cliente.pessoa.contatoImediato} 
                                    onChange={(e) => handleChangeInput(e, 'contatoImediato') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Apelido</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. Lorem Ipsum" 
                                    value={cliente.pessoa.apelido} 
                                    onChange={(e) => handleChangeInput(e, 'apelido') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Telefone</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. (47) 999900000" 
                                    value={cliente.pessoa.telefone} 
                                    onChange={(e) => handleChangeInput(e, 'telefone') }
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Email</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. (47) 999900000" 
                                    value={cliente.pessoa.email} 
                                    onChange={(e) => handleChangeInput(e, 'email') }
                                />
                            </div>  
                            
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Senha</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex. *******" 
                                    value={cliente.senha} 
                                    onChange={(e) => handleChangeSenha(e) }
                                />
                            </div>                                                       
                        </div>

                        <button type="button" onClick={(e) => salvarCliente(e)} className="btn btn-sm btn-primary"> <i className="fas fa-check"></i>&nbsp;&nbsp;  Salvar</button>
                        <button type="button" onClick={() => history.back() } className="btn btn-sm btn-info m-1"><i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Cancelar</button>

                    </form>
                </div>
            </Content>
        </>
    );

}
