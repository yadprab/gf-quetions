import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import InvoicesPage from './pages/InvoicesPage';

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Navigate
							to="/invoices"
							replace
						/>
					}
				/>
				<Route
					path="/invoices"
					element={<InvoicesPage />}
				/>
				<Route
					path="*"
					element={<p>Page not found</p>}
				/>
			</Routes>
		</Router>
	);
}

export default App;
