import Pessoa from "./Pessoa";

export default class Colaborador {

    pessoa:Pessoa = null; 
    cpf: string;
    rg: string;
    orgao_emissor: string;
    uf_emissor: string;
    sexo: string;
    senha: string;
    data_admissao: Date;
    data_demissao: Date;      

    constructor(){
        this.pessoa = this.pessoa == null ? new Pessoa() : this.pessoa; 
    }

};