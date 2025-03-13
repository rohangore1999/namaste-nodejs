import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

// Components
import Body from "./components/Body";
import Login from "./components/Login";
import Feeds from "./components/Feeds";
import Connections from "./components/Connections";
import Profile from "./components/Profile";
import Requests from "./components/Requests";
import PaymentStatus from "./components/PaymentStatus";

// Utils
import appStore from "./utils/appStore";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            {/* children routes - Outlets */}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/" element={<Feeds />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
