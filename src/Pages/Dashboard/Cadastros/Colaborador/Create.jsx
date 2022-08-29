import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { NotificationManager } from 'react-notifications';
import SelectBox from 'devextreme-react/select-box';

import Loading from '../../../../Componentes/Loading';
import history from '../../../../Componentes/History';
import Content from '../../../../Componentes/Content';
import ColaboradorModel from '../../../../Models/Colaborador.ts';

export default function ColaboradorCreate() {

    const { colaborador_id } = useParams();
    const [showLoader, setShowLoader] = useState(false);
    const [colaborador, setColaborador] = useState(new ColaboradorModel());
    const [redirect, setRedirect] = useState(false);

    useEffect(function () {

        if (colaborador_id != null) {
            setShowLoader(true);
            axios.get(`api/colaborador/get/${colaborador_id}`)
                .then((response) => {
                    setColaborador(response.data);                         
                    setShowLoader(false);
                })
                .catch((error) => {
                    NotificationManager.error(JSON.stringify(error), 'Colaborador');
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
                setColaborador({ ...colaborador, pessoa: { ...colaborador.pessoa, foto: result }});
            });
    }
      
    const handleChangeInput = function (e, attr) {
        colaborador.pessoa[attr] = e.value;
        setColaborador({ ...colaborador });
    };

    const salvarColaborador = function (e) {

        setShowLoader(true);

        axios.post('api/colaborador/createOrUpdate', colaborador)
            .then((response) => {
                setShowLoader(false);
                if(response.data.status === false){
                    NotificationManager.error(response.data.message, 'Colaborador');
                } else {
                    NotificationManager.success('Cadastro realizado com sucesso.', 'Colaborador');
                    setRedirect(true);
                }
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Colaborador');
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
                                <div id="imagePreview" style={{ backgroundImage: colaborador.pessoa.foto ? `url(${colaborador.pessoa.foto})` : "url('images/contacts/user.jpg')" }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group mb-3 col-6">
                            <label className="form-label">Nome do Colaborador</label>
                            <TextBox
                                value={colaborador.pessoa.razao}
                                onValueChanged={(e) => handleChangeInput(e, 'razao')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Contato Imediato</label>
                            <TextBox
                                value={colaborador.pessoa.contatoImediato}
                                onValueChanged={(e) => handleChangeInput(e, 'contatoImediato')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Apelido</label>
                            <TextBox
                                value={colaborador.pessoa.apelido}
                                onValueChanged={(e) => handleChangeInput(e, 'apelido')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Telefone</label>
                            <TextBox
                                value={colaborador.pessoa.telefone}
                                onValueChanged={(e) => handleChangeInput(e, 'telefone')}
                            />
                        </div>

                        <div className="form-group mb-3 col-md-6">
                            <label className="form-label">Email</label>
                            <TextBox
                                value={colaborador.pessoa.email}
                                onValueChanged={(e) => handleChangeInput(e, 'email')}
                            />
                        </div>  

                        <div className="form-group col-6">
                            <label>Sexo</label>
                            <SelectBox
                                showClearButton={true}
                                dataSource={[
                                    {
                                        id: 'feminino',
                                        descricao: 'Feminino'
                                    },
                                    {
                                        id: 'masculino',
                                        descricao: 'Masculino'
                                    }
                                ]}
                                displayExpr="descricao"
                                valueExpr="id"
                                value={colaborador.sexo}     
                                onSelectionChanged={(e) => {
                                    colaborador.sexo = e.selectedItem.id;
                                    setColaborador({ ...colaborador });
                                }}
                            />
                        </div>

                        <div className="form-group mb-3 col-6">
                            <label className="form-label">Senha</label>
                            <TextBox
                                value={colaborador.senha}
                                onValueChanged={(e) => {
                                    colaborador.senha = e.value;
                                    setColaborador({ ...colaborador });
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
                            onClick={(e) => salvarColaborador(e)}
                        />
                    </div>
                </form>
            </>
        );
    }

    if (redirect) {
        return <Navigate to="/app/colaboradores" />
    }

    return (
        <>
            <Content titulo="Cadastro de Colaboradores">
                {renderPage()}
            </Content>
        </>
    );

}
