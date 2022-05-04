import React from 'react';
import Content from '../../Componentes/Content';
import Kanban from './OrdemServico/Kanban';

export default function PaginaInicial() {
  return (
    <>
        <Content titulo="Página Inicial">
          <Kanban />
        </Content>
    </>
  )
}
