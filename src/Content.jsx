import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Funcionario from './Pages/Cadastros/Funcionario';
import FuncionarioCreate from './Pages/Cadastros/FuncionarioCreate';
import NotFound from './Pages/NotFound';

import Cards from './Componentes/Dashboard/Cards';
import Login from './Pages/Login';

// import Login from './Pages/Login';


class Content extends Component {
    render() {
        return (
            <>
                <Routes>
                    <Route exact path="/cards" element={<Cards />} />
                    <Route exact path="/funcionarios" element={<Funcionario />} />
                    <Route exact path="/funcionarios-create" element={<FuncionarioCreate />} />

                
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </>
        );
    }
}

export default Content;