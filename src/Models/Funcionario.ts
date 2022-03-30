import Pessoa from "./Pessoa";


export default class Funcionario {

    pessoa:Pessoa = null;    

    constructor(){
        this.pessoa = this.pessoa == null ? new Pessoa() : this.pessoa; 
    }

};