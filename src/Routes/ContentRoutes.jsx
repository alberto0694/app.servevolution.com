import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../Componentes/ScrollToTop';

import FuncionarioList from '../Pages/Dashboard/Cadastros/Funcionario/List';
import FuncionarioCreate from '../Pages/Dashboard/Cadastros/Funcionario/Create';

import TipoServicoList from '../Pages/Dashboard/Cadastros/TipoServico/List';
import TipoServicoCreate from '../Pages/Dashboard/Cadastros/TipoServico/Create';

import ClienteList from '../Pages/Dashboard/Cadastros/Cliente/List';
import ClienteCreate from '../Pages/Dashboard/Cadastros/Cliente/Create';

import NotFound from '../Pages/NotFound';

import Agendamento from '../Pages/Dashboard/OrdemServico/Agendamento';
import AgendamentosCliente from '../Pages/Dashboard/Cliente/Agendamentos';
import OrdemServicoCreate from '../Pages/Dashboard/OrdemServico/Create';
import TabelaPrecoList from '../Pages/Dashboard/Cadastros/TabelaPreco/List';

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

                    <Route exact path="/tipo-servicos" element={<TipoServicoList />} />
                    <Route exact path="/tipo-servicos-create" element={<TipoServicoCreate />} />
                    <Route exact path="/tipo-servicos-create/:tipo_servico_id" element={<TipoServicoCreate />} />

                    <Route exact path="/clientes" element={<ClienteList />} />
                    <Route exact path="/cliente-create" element={<ClienteCreate />} />
                    <Route exact path="/cliente-create/:cliente_id" element={<ClienteCreate />} />

                    <Route exact path="/tabelas-preco" element={<TabelaPrecoList />} />

                    <Route exact path="/ordem-servicos/agendamentos" element={<Agendamento />} />
                    <Route exact path="/ordem-servico-create" element={<OrdemServicoCreate />} />
                    <Route exact path="/ordem-servico-create/:ordem_servico_id" element={<OrdemServicoCreate />} />


                    <Route exact path="/cliente/agendamentos" element={<AgendamentosCliente />} />
                                    
                    <Route path="/*" element={<NotFound/>} />
                    
                </Routes>
            </>
        );
    }
    
}

export default ContentRoutes;