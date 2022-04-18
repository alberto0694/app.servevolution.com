import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute";
import Container from "./Pages/Container";
import AuthRoute from "./Routes/AuthRoute";
import history from './Componentes/History';
import ScrollToTop from "./Componentes/ScrollToTop";

import 'devextreme/dist/css/dx.light.css';
import 'react-notifications/lib/notifications.css';

export default class App extends Component {

	render() {

		return (
			<>
				<BrowserRouter>

					<ScrollToTop />

					<Routes  history={history}>

						<Route
							path="/app/*" 
							element={
								<AuthRoute>
									<Container/>
								</AuthRoute>
							} 
						/>	

						<Route exact path="/*" element={<PublicRoute />} />

					</Routes>
				</BrowserRouter>
			</>

		);

	}

}
