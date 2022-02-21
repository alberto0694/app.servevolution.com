import React, { Component } from "react";
import { BrowserRouter, Navigate } from "react-router-dom";
import Container from "./Container";
import { Route, Routes, Outlet } from "react-router-dom";
import Login from "./Pages/Login";
import PublicLayout from "./PublicLayout";
import PrivateLayout from "./PrivateLayout";
import PrivateRoute from "./PrivateRoute";

const isAuthenticated = true;

export default class App extends Component {

	render() {
		return (

			<>
				<BrowserRouter>
					<Routes>

						<Route 
							path="/app/*" 
							element={
								<PrivateRoute>
									<PrivateLayout/>
								</PrivateRoute>
							} 
						/>	

						<Route exact path="/login" element={<PublicLayout />} />
						<Route exact path="/*" element={<PublicLayout />} />

					</Routes>
				</BrowserRouter>
			</>

		);

	}

}
