import Pessoa from "./Pessoa";


export default class Cliente {

    pessoa:Pessoa = null;
    senha: string = '';    

    constructor(){
        this.pessoa = this.pessoa == null ? new Pessoa() : this.pessoa; 
    }

};