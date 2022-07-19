import Popup from 'devextreme-react/popup';
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Pager,
    Paging,
    SearchPanel,
} from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';

import Content from '../../../../Componentes/Content';
import FuncionarioModel from '../../../../Models/Funcionario.ts';
import Loading from '../../../../Componentes/Loading';

class FuncionarioList extends Component {

    funcionario = new FuncionarioModel();
    swal = withReactContent(Swal);

    constructor(props) {
        super(props);

        this.state = {
            funcionarios: [],
            funcionario: this.funcionario,
            showLoader: true,
            showCadastroRapido: false
        };

        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    renderFotoCell(cellData){
        return (
            <img className="rounded-circle" width="35" src={ cellData.value || "images/contacts/user.jpg" } alt=""/>
        );
    }

    getBase64(file) {

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

    onFileChange(e){
        this.getBase64(e.target.files[0])
                .then((result) => {
                    this.funcionario.pessoa.foto = result;
                    this.setState({ funcionario: this.funcionario});
                });
    }

    componentDidMount() {

        this.getListFuncionarios();

    }

    getListFuncionarios(){

        this.setState({ showLoader: true });
        axios.get('/api/funcionario/list')
            .then((response) => {                      
                if(response.data.status === false){
                    this.setState({ showLoader: false });
                    NotificationManager.error(response.data.message, 'Funcionário');
                } else{
                    this.setState({ funcionarios: response.data, showLoader: false });
                }                
            })
            .catch((error) => {            
                NotificationManager.error(JSON.stringify(error), 'Funcionário');
            });
    }

    salvarFuncionario() {
        
        this.setState({ showLoader: true });
        axios.post('api/funcionario/createOrUpdate', this.state.funcionario)
            .then((response) => {
    
                NotificationManager.success('Funcionário criado com sucesso.', 'Funcionário');
                this.setState({ showCadastroRapido: false });
                this.getListFuncionarios();
    
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Funcionário');
            });
    };

    handleChangeInput(e, attr){
        this.funcionario.pessoa[attr] = e.value;
        this.setState({ funcionario: this.funcionario });
    };

    showCadastroRapido(){
        this.setState({ funcionario : new FuncionarioModel(), showCadastroRapido: true })
    }

    showModalExcluir(e, func){

        if (func == null){ 
            NotificationManager.warning('Funcionário não encontrado', 'Funcionário');
            return;
        }

        this.swal.fire({
            title: 'Exclusão de funcionário!',
            text: 'Deseja realmente excluir este registro?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
        .then((response) => {
            
            if(response.isConfirmed){                
                this.setState({showLoader: true});
                axios.get(`api/funcionario/delete/${func.id}`)
                    .then((response) => {                    
                        this.setState({showLoader: false, funcionarios: response.data});
                        NotificationManager.success('Excluído com sucesso', 'Funcionário');                        
                    })
                    .catch((error) => {
                        this.setState({showLoader: false});
                        NotificationManager.error(JSON.stringify(error), 'Funcionário');
                    });
            }
        });

    }

    renderFuncionarios() {

        return (
            <>
                <DataGrid
                    dataSource={this.state.funcionarios}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                >
                    <GroupPanel visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Grouping autoExpandAll={false} />

                    <Column 
                        dataField={ "pessoa.foto" }
                        cellRender={this.renderFotoCell} 
                        alignment="center"
                        width={90}
                        caption=""
                    />
                    <Column  
                        caption="Nome"
                        dataField={ "pessoa.normalized_name" }
                    />
                    <Column 
                        dataField="pessoa.contatoImediato" 
                        dataType="string" 
                    />
                    <Column 
                        alignment="center"
                        caption="Ações"
                        width={120}
                        cellRender={(cellData) => {
                            const { data } = cellData;
                            return (
                                <>
                                    <div className="d-flex justify-center">
                                        <Link to={`/app/funcionario-create/${data.id}`}>
                                            <Button
                                                type="normal"
                                                icon='fas fa-pencil-alt'
                                            />
                                        </Link>
                                        <Button
                                            className='ml-1'
                                            type="normal"
                                            icon='fas fa-trash'
                                            onClick={(e) => this.showModalExcluir(e, data)}
                                        />
                                    </div>
                                </>
                            )
                        }}
                    />                        
                    
                    <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={false} />
                    <Paging defaultPageSize={10} />
                </DataGrid>
            </>
        );
    }

    renderCadastroRapidoPopUp = () => {

        return (
            <>
                <Popup
                    width={440}
                    height={540}
                    showTitle={true}
                    title={'Ordem de Serviço'}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    visible={this.state.showCadastroRapido}
                    onHiding={() => {
                        this.setState({ showCadastroRapido: false });
                    }}
                    contentRender={() => {
                        return (
                            <>
                                <div className="row">
                                    <div className="image-placeholder">
                                        <div className="avatar-edit">
                                            <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" onChange={(e) => this.onFileChange(e)} />
                                            <label htmlFor="imageUpload"></label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div id="imagePreview" style={{ backgroundImage: this.state.funcionario.pessoa.foto ? `url(${this.state.funcionario.pessoa.foto})` : "url('images/contacts/user.jpg')" }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group mb-3 col-12">
                                        <label className="form-label">Nome do funcionário</label>
                                        <TextBox
                                            value={this.state.funcionario?.pessoa.razao}
                                            onValueChanged={(e) => this.handleChangeInput(e, 'razao')}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group mb-3 col-12">
                                        <label className="form-label">Apelido</label>
                                        <TextBox
                                            value={this.state.funcionario?.pessoa.apelido}
                                            onValueChanged={(e) => this.handleChangeInput(e, 'apelido')}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group mb-3 col-12">
                                        <label className="form-label">Contato Imediato</label>
                                        <TextBox
                                            value={this.state.funcionario?.pessoa.contatoImediato}
                                            onValueChanged={(e) => this.handleChangeInput(e, 'contatoImediato')}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-end">
                                    <Button
                                        text="Voltar"
                                        type="danger"

                                        icon='fas fa-arrow-left'
                                        stylingMode="contained"
                                        onClick={(e) => this.setState({showCadastroRapido: false})}
                                    />

                                    <Button
                                        text="Salvar"
                                        className='ml-1'
                                        type="success"
                                        icon='fas fa-check'
                                        stylingMode="contained"
                                        onClick={(e) => this.salvarFuncionario()}
                                    />
                                </div>

                            </>
                        )
                    }}
                />
            </>
        )
    }

    renderPage(){

        if(this.state.showLoader){

            return <Loading/>

        } else {

            return(
                <>
                    <div className="project-nav justify-content-end">
                        <div className="d-flex align-items-center">
                            
                            <Button
                                text="Cadastro Rápido"
                                type="normal"
                                icon='fas fa-address-book'
                                stylingMode="contained"
                                onClick={() => this.showCadastroRapido() }
                            />
                            <Link to={`/app/funcionario-create`} className="m-1">
                                <Button
                                    text="Novo Funcionário"
                                    type="normal"
                                    icon='fas fa-plus'
                                    stylingMode="contained"
                                />                            
                            </Link>

                        </div>
                    </div>
    
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navpills-1" >
                            <div className="row dz-scroll  loadmore-content searchable-items list" id="allContactListContent">
                                <div className="items items-header-section">
                                </div>
                                
                                { this.renderFuncionarios() }
    
                            </div>
                        </div>
                    </div>
    
                    { this.renderCadastroRapidoPopUp() }
                </>
            );
        }       
    }

    render() {

        return (
            <>
                <Content titulo="Lista de Funcionários">

                    { this.renderPage() }
                    
                </Content>
            </>
        );
    }

}

export default FuncionarioList;