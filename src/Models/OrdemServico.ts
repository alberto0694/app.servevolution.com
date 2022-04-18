import Cliente from './Cliente';
import Funcionario from './Funcionario';
import TipoServico from './TipoServico';
import OrdemServicoCusto from './OrdemServicoCusto';

export default class OrdemServico{

    titulo: string = "";
    descricao: string = "";
    cliente: Cliente = null;
    tipoServico: TipoServico = null;
    cliente_id: number;
    tipo_servico_id: number; 

    funcionarios:Array<Funcionario> = [];
    custos:Array<OrdemServicoCusto> = [];

    constructor(){
        this.cliente = this.cliente == null ? new Cliente() : this.cliente; 
        this.tipoServico = this.tipoServico == null ? new TipoServico() : this.tipoServico; 
        this.funcionarios = [];
        this.custos = [];
    }

};