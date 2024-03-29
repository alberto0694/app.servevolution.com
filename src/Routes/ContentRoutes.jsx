import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

import FuncionarioList from '../Pages/Dashboard/Cadastros/Funcionario/List';
import FuncionarioCreate from '../Pages/Dashboard/Cadastros/Funcionario/Create';

import ColaboradorList from '../Pages/Dashboard/Cadastros/Colaborador/List';
import ColaboradorCreate from '../Pages/Dashboard/Cadastros/Colaborador/Create';

import TipoServicoList from '../Pages/Dashboard/Cadastros/TipoServico/List';
import TipoServicoCreate from '../Pages/Dashboard/Cadastros/TipoServico/Create';

import TipoCustoList from '../Pages/Dashboard/Cadastros/TipoCusto/List';
import TipoCustoCreate from '../Pages/Dashboard/Cadastros/TipoCusto/Create';

import UnidadeMedidaList from '../Pages/Dashboard/Cadastros/UnidadeMedida/List';
import UnidadeMedidaCreate from '../Pages/Dashboard/Cadastros/UnidadeMedida/Create';

import ClienteList from '../Pages/Dashboard/Cadastros/Cliente/List';
import ClienteCreate from '../Pages/Dashboard/Cadastros/Cliente/Create';

import NotFound from '../Pages/NotFound';

import Agendamento from '../Pages/Dashboard/OrdemServico/Agendamento';
import OrdemServicoCreate from '../Pages/Dashboard/OrdemServico/Create';

import PagamentoFuncionario from '../Pages/Dashboard/Financeiro/PagamentoFuncionario';
import ContasPagar from '../Pages/Dashboard/Financeiro/ContasPagar';
import ContasReceber from '../Pages/Dashboard/Financeiro/ContasReceber';
import Titulos from '../Pages/Dashboard/Financeiro/Titulos';

import ServicosPrestados from '../Pages/Dashboard/Relatorios/ServicosPrestados';

import PaginaInicial from '../Pages/Dashboard/PaginaInicial';


class ContentRoutes extends Component {

    render() {
        return (
            <>
                <Routes>
                                       
                    <Route exact path="/" element={<PaginaInicial />} />
                    
                    <Route exact path="/funcionarios" element={<FuncionarioList />} />
                    <Route exact path="/funcionario-create" element={<FuncionarioCreate />} />
                    <Route exact path="/funcionario-create/:funcionario_id" element={<FuncionarioCreate />} />

                    <Route exact path="/colaboradores" element={<ColaboradorList />} />
                    <Route exact path="/colaborador-create" element={<ColaboradorCreate />} />
                    <Route exact path="/colaborador-create/:colaborador_id" element={<ColaboradorCreate />} />

                    <Route exact path="/tipo-servicos" element={<TipoServicoList />} />
                    <Route exact path="/tipo-servicos-create" element={<TipoServicoCreate />} />
                    <Route exact path="/tipo-servicos-create/:tipo_servico_id" element={<TipoServicoCreate />} />

                    <Route exact path="/tipo-custos" element={<TipoCustoList />} />
                    <Route exact path="/tipo-custos-create" element={<TipoCustoCreate />} />
                    <Route exact path="/tipo-custos-create/:tipo_custo_id" element={<TipoCustoCreate />} />

                    <Route exact path="/unidade-medida" element={<UnidadeMedidaList />} />
                    <Route exact path="/unidade-medida-create" element={<UnidadeMedidaCreate />} />
                    <Route exact path="/unidade-medida-create/:unidade_medida_id" element={<UnidadeMedidaCreate />} />

                    <Route exact path="/clientes" element={<ClienteList />} />
                    <Route exact path="/cliente-create" element={<ClienteCreate />} />
                    <Route exact path="/cliente-create/:cliente_id" element={<ClienteCreate />} />

                    <Route exact path="/financeiro/pagamento-funcionario" element={<PagamentoFuncionario />} />
                    <Route exact path="/financeiro/contas-pagar" element={<ContasPagar />} />
                    <Route exact path="/financeiro/contas-receber" element={<ContasReceber />} />
                    <Route exact path="/financeiro/titulos" element={<Titulos />} />

                    <Route exact path="/relatorios/servicos-prestados" element={<ServicosPrestados />} />

                    <Route exact path="/ordem-servicos/agendamentos" element={<Agendamento />} />
                    <Route exact path="/ordem-servico-create" element={<OrdemServicoCreate />} />
                    <Route exact path="/ordem-servico-create/:ordem_servico_id" element={<OrdemServicoCreate />} />

                    <Route exact path="/cliente/agendamentos" element={<Agendamento />} />
                                    
                    <Route path="/*" element={<NotFound/>} />
                    
                </Routes>
            </>
        );
    }
    
}

export default ContentRoutes;