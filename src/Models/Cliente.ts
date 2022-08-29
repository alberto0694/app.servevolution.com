import Pessoa from "./Pessoa";
import ValorFuncionario from "./ValorFuncionario";
import ValorServico from './ValorServico';


export default class Cliente {

    pessoa:Pessoa = null;
    senha: string = '';  
    valores_funcionarios:Array<ValorFuncionario> = [];
    valores_servicos:Array<ValorServico> = [];

    constructor(){
        this.pessoa = this.pessoa == null ? new Pessoa() : this.pessoa;        
    }

};