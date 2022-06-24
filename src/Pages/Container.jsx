import React, { Component } from "react";
import Menu from "../Componentes/Menu";
import ContentRoutes from "../Routes/ContentRoutes";
import PreLoader from "../Componentes/PreLoader";
import NavHeader from "../Componentes/NavHeader";
import Header from "../Componentes/Header";

export default class Container extends Component {


    render() {
        return (
            <>
                <PreLoader></PreLoader>

                <div id="main-wrapper">

                    <NavHeader></NavHeader>

                    <Header></Header>

                    <Menu />

                    <div className="content-body" style={{ background: '#eee', paddingTop: '65px' }}>
                        <div className="container-fluid">

                            <ContentRoutes/>

                        </div>
                    </div>


                </div>


            </>
        );

    }
}
