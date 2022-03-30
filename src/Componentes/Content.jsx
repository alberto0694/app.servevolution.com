import React, { Component } from 'react'

export default class Content extends Component {


    constructor(props)
    {
        super(props);

    }



    render() {
        return (
            <>
                <div className="row">
                    <div className="col-xl-12 col-xxl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{ this.props.titulo }</h4>
                            </div>
                            <div className="card-body">
                                { this.props.children }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
