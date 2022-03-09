import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

import Funcionario from '../Pages/Dashboard/Cadastros/Funcionario';
import FuncionarioCreate from '../Pages/Dashboard/Cadastros/FuncionarioCreate';

import NotFound from '../Pages/NotFound';
import Cards from '../Componentes/Cards';
import Grid from '../Componentes/Grid';


class ContentRoutes extends Component {
    render() {
        return (
            <>
                <Routes>
                    <Route exact path="/cards" element={<Cards />} />
                    <Route exact path="/funcionarios" element={<Funcionario />} />
                    <Route exact path="/funcionario-create" element={<FuncionarioCreate />} />
                    <Route exact path="/funcionario-create/:funcionario_id" element={<FuncionarioCreate />} />
                    <Route exact path="/grid" element={<Grid />} />
                
                    <Route path="/*" element={<NotFound/>} />
                </Routes>
            </>
        );
    }
}

export default ContentRoutes;