import OrdemServicoFuncionario from './OrdemServicoFuncionario';

export default class OrdemServicoCusto{

    ordem_servico_funcionario_id: number = 0;
    tipo_custo_id: number = 0;
    valor: number = 0;
    ativo: boolean = true;    
    ordem_servico_funcionario: OrdemServicoFuncionario = null;

    constructor(){
        this.ordem_servico_funcionario = this.ordem_servico_funcionario == null ? new OrdemServicoFuncionario() : this.ordem_servico_funcionario; 
    }

};