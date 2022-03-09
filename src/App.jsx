import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute";
import Container from "./Pages/Container";
import PrivateRoute from "./Routes/PrivateRoute";
import history from './Componentes/History';

import 'devextreme/dist/css/dx.light.css';

export default class App extends Component {

	render() {
		return (

			<>
				<BrowserRouter>
					<Routes  history={history}>

						<Route
							path="/app/*" 
							element={
								<PrivateRoute>
									<Container/>
								</PrivateRoute>
							} 
						/>	

						<Route exact path="/login" element={<PublicRoute />} />
						<Route exact path="/*" element={<PublicRoute />} />

					</Routes>
				</BrowserRouter>
			</>

		);

	}

}
