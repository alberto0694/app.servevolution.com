import React, { Component } from 'react';

class FuncionarioCreate extends Component {
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-xl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Dados do Funcionário</h4>
                            </div>
                            <div className="card-body">
                                <div className="basic-form">
                                    <form>
                                        <div className="mb-3">
                                            <input type="text" className="form-control input-default " placeholder="input-default"/>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control input-rounded" placeholder="input-rounded"/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default FuncionarioCreate;