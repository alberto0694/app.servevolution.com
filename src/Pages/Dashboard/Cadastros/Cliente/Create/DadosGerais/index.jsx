import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import TextBox from 'devextreme-react/text-box';

export default function ClienteCreate({cliente, setCliente}) {
    
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
                setCliente({ ...cliente, pessoa: { ...cliente.pessoa, foto: result }});
            });
    }    

    const handleChangeInput = function (e, attr) {
        cliente.pessoa[attr] = e.value;
        setCliente({ ...cliente });
    };

    const handleChangeSenha = function (e) {
        cliente.senha = e.value;
        setCliente({ ...cliente });
    };

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
                            <div id="imagePreview" style={{ backgroundImage: cliente.pessoa?.foto ? `url(${cliente.pessoa?.foto})` : "url('images/contacts/user.jpg')" }}>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="form-group mb-3 col-6">
                        <label className="form-label">Nome do cliente</label>
                        <TextBox
                            value={cliente.pessoa.razao}
                            onValueChanged={(e) => handleChangeInput(e, 'razao')}
                        />
                    </div>

                    <div className="form-group mb-3 col-6">
                        <label className="form-label">Contato Imediato</label>
                        <TextBox
                            value={cliente.pessoa.contatoImediato}
                            onValueChanged={(e) => handleChangeInput(e, 'contatoImediato')}
                        />
                    </div>

                </div>

                <div className="row">
                    <div className="form-group mb-3 col-6">
                        <label className="form-label">Apelido</label>
                        <TextBox
                            value={cliente.pessoa.apelido}
                            onValueChanged={(e) => handleChangeInput(e, 'apelido')}
                        />
                    </div>

                    <div className="form-group mb-3 col-6">
                        <label className="form-label">Telefone</label>
                        <TextBox
                            value={cliente.pessoa.telefone}
                            onValueChanged={(e) => handleChangeInput(e, 'telefone')}
                        />
                    </div>

                </div>

                <div className="row">
                    <div className="form-group mb-3 col-6">
                        <label className="form-label">E-mail</label>
                        <TextBox
                            value={cliente.pessoa.email}
                            onValueChanged={(e) => handleChangeInput(e, 'email')}
                        />
                    </div>

                    <div className="form-group mb-3 col-6">
                        <label className="form-label">Senha</label>
                        <TextBox
                            value={cliente.senha}
                            onValueChanged={(e) => handleChangeSenha(e)}
                        />
                    </div>

                </div>
                
            </form>
        </>
    )

}
