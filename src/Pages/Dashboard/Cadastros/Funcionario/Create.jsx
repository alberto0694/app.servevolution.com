import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { NotificationManager } from 'react-notifications';
import TagBox from 'devextreme-react/tag-box';

import Loading from '../../../../Componentes/Loading';
import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import FuncionarioModel from '../../../../Models/Funcionario.ts';

export default function FuncionarioCreate() {

    const { funcionario_id } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    const [tipoServicos, setTipoServicos] = useState([]);
    const [selectedServicos, setSelectedServicos] = useState([]);
    const [funcionario, setFuncionario] = useState(new FuncionarioModel());
    const [redirect, setRedirect] = useState(false);

    useEffect(function () {

        getTipoServicos();

        if (funcionario_id != null) {
            setShowLoader(true);
            axios.get(`api/funcionario/get/${funcionario_id}`)
                .then((response) => {
                    const tpServicos = response.data.tipo_servicos?.map((s) => s.id);
                    setSelectedServicos(tpServicos || []);
                    setFuncionario(response.data);                         
                    setShowLoader(false);
                })
                .catch((error) => {
                    NotificationManager.error(JSON.stringify(error), 'Funcionário');
                    setShowLoader(false);
                });
        }
    }, []);

    const getBase64 = (file) => {

        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              resolve(reader.result);
            };
            reader.onerror = function (error) {
              reject(error);
            };
            
        });
    }

    const onFileChange = (e) => {
        getBase64(e.target.files[0])
            .then((result) => {
                setFuncionario({ ...funcionario, pessoa: { ...funcionario.pessoa, foto: result }});
            });
    }

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

    const handleChangeInput = function (e, attr) {
        funcionario.pessoa[attr] = e.value;
        setFuncionario({ ...funcionario });
    };

    const salvarFuncionario = function (e) {

        setShowLoader(true);
        funcionario.tipo_servicos = tipoServicos.filter((s) => selectedServicos.indexOf(s.id) > -1);

        axios.post('api/funcionario/createOrUpdate', funcionario)
            .then((response) => {
                setShowLoader(false);
                if(response.data.status === false){
                    NotificationManager.error(response.data.message, 'Funcionário');
                } else {
                    NotificationManager.success('Cadastro realizado com sucesso.', 'Funcionário');
                    setRedirect(true);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Funcionário');
                setShowLoader(false);
            });

    };

    const renderPage = () => {

        if (showLoader) {
            return <Loading />
        }

        return (
            <>
                <form>
                    <div className="row mb-1">
                        <div className="image-placeholder">
                            <div className="avatar-edit">
                                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" onChange={(e) => onFileChange(e)} />
                                <label htmlFor="imageUpload"></label>
                            </div>
                            <div className="avatar-preview">
                                <div id="imagePreview" style={{ backgroundImage: funcionario.pessoa.foto ? `url(${funcionario.pessoa.foto})` : "url('images/contacts/user.jpg')" }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group mb-3 col-6">
                            <label className="form-label">Nome do funcionário</label>
                            <TextBox
                                value={funcionario.pessoa.razao}
                                onValueChanged={(e) => handleChangeInput(e, 'razao')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Contato Imediato</label>
                            <TextBox
                                value={funcionario.pessoa.contatoImediato}
                                onValueChanged={(e) => handleChangeInput(e, 'contatoImediato')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Apelido</label>
                            <TextBox
                                value={funcionario.pessoa.apelido}
                                onValueChanged={(e) => handleChangeInput(e, 'apelido')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Telefone</label>
                            <TextBox
                                value={funcionario.pessoa.telefone}
                                onValueChanged={(e) => handleChangeInput(e, 'telefone')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Email</label>
                            <TextBox
                                value={funcionario.pessoa.email}
                                onValueChanged={(e) => handleChangeInput(e, 'email')}
                            />
                        </div>

                        <div className="form-group col-6">
                            <label>Serviços</label>
                            <TagBox
                                searchEnabled={true}
                                showClearButton={true}
                                dataSource={tipoServicos}
                                displayExpr="descricao"
                                valueExpr="id"
                                value={selectedServicos}
                                selectedItems={selectedServicos}
                                onValueChanged={(item) => {
                                    console.log('passei aqui');
                                    setSelectedServicos(item.value);
                                }}
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
                            onClick={(e) => salvarFuncionario(e)}
                        />
                    </div>
                </form>
            </>
        );
    }

    if (redirect) {
        return <Navigate to="/app/funcionarios" />
    }

    return (
        <>
            <Content titulo="Cadastro de Funcionários">
                {renderPage()}
            </Content>
        </>
    );

}
