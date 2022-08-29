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
    FilterRow
} from 'devextreme-react/data-grid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { NotificationManager } from 'react-notifications';

import Content from '../../../../Componentes/Content';
import ColaboradorModel from '../../../../Models/Colaborador.ts';
import Loading from '../../../../Componentes/Loading';

class ColaboradorList extends Component {

    colaborador = new ColaboradorModel();
    swal = withReactContent(Swal);

    constructor(props) {
        super(props);

        this.state = {
            colaboradors: [],
            colaborador: this.colaborador,
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
                    this.colaborador.pessoa.foto = result;
                    this.setState({ colaborador: this.colaborador});
                });
    }

    componentDidMount() {

        this.getListColaboradores();

    }

    getListColaboradores(){

        this.setState({ showLoader: true });
        axios.get('/api/colaborador/list')
            .then((response) => {                      
                if(response.data.status === false){
                    this.setState({ showLoader: false });
                    NotificationManager.error(response.data.message, 'Colaborador');
                } else{
                    this.setState({ colaboradores: response.data, showLoader: false });
                }                
            })
            .catch((error) => {            
                NotificationManager.error(JSON.stringify(error), 'Colaborador');
            });
    }

    salvarColaborador() {
        
        this.setState({ showLoader: true });
        axios.post('api/colaborador/createOrUpdate', this.state.colaborador)
            .then((response) => {
    
                NotificationManager.success('Colaborador criado com sucesso.', 'Colaborador');
                this.setState({ showCadastroRapido: false });
                this.getListColaboradores();
    
            })
            .catch((error) => {
                NotificationManager.error(JSON.stringify(error), 'Colaborador');
            });
    };

    handleChangeInput(e, attr){
        this.colaborador.pessoa[attr] = e.value;
        this.setState({ colaborador: this.colaborador });
    };

    showCadastroRapido(){
        this.setState({ colaborador : new ColaboradorModel(), showCadastroRapido: true })
    }

    showModalExcluir(e, func){

        if (func == null){ 
            NotificationManager.warning('Colaborador não encontrado', 'Colaborador');
            return;
        }

        this.swal.fire({
            title: 'Exclusão de Colaborador!',
            text: 'Deseja realmente excluir este registro?',
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não, cancelar',
        })
        .then((response) => {
            
            if(response.isConfirmed){                
                this.setState({showLoader: true});
                axios.get(`api/colaborador/delete/${func.id}`)
                    .then((response) => {                    
                        this.setState({showLoader: false, colaboradores: response.data});
                        NotificationManager.success('Excluído com sucesso', 'Colaborador');                        
                    })
                    .catch((error) => {
                        this.setState({showLoader: false});
                        NotificationManager.error(JSON.stringify(error), 'Colaborador');
                    });
            }
        });

    }

    renderColaboradores() {

        return (
            <>
                <DataGrid
                    dataSource={this.state.colaboradores}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                >
                    <FilterRow visible={true} applyFilter='auto' />
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
                                        <Link to={`/app/colaborador-create/${data.id}`}>
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
                                            <div id="imagePreview" style={{ backgroundImage: this.state.colaborador.pessoa.foto ? `url(${this.state.colaborador.pessoa.foto})` : "url('images/contacts/user.jpg')" }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group mb-3 col-12">
                                        <label className="form-label">Nome do Colaborador</label>
                                        <TextBox
                                            value={this.state.colaborador?.pessoa.razao}
                                            onValueChanged={(e) => this.handleChangeInput(e, 'razao')}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group mb-3 col-12">
                                        <label className="form-label">Apelido</label>
                                        <TextBox
                                            value={this.state.colaborador?.pessoa.apelido}
                                            onValueChanged={(e) => this.handleChangeInput(e, 'apelido')}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group mb-3 col-12">
                                        <label className="form-label">Contato Imediato</label>
                                        <TextBox
                                            value={this.state.colaborador?.pessoa.contatoImediato}
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
                                        onClick={(e) => this.salvarColaborador()}
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
                            
                            {/* <Button
                                text="Cadastro Rápido"
                                type="normal"
                                icon='fas fa-address-book'
                                stylingMode="contained"
                                onClick={() => this.showCadastroRapido() }
                            /> */}
                            <Link to={`/app/colaborador-create`} className="m-1">
                                <Button
                                    text="Novo Colaborador"
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
                                
                                { this.renderColaboradores() }
    
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
                <Content titulo="Lista de Colaboradores">

                    { this.renderPage() }
                    
                </Content>
            </>
        );
    }

}

export default ColaboradorList;