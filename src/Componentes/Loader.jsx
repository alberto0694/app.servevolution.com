import React, { Component } from 'react'

export default class Loader extends Component {
    render() {
        return (
            <>
                <div class="d-flex justify-content-center align-items-center vh-100">
                    <div class="prifix_loading_box"> <span></span> <span></span> <span></span> <span></span> <span></span> </div>
                </div>
            </>
        )
    }
}
