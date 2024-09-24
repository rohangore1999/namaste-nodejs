import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

// Components
import Body from "./components/Body";
import Login from "./components/Login";
import Feeds from "./components/Feeds";
import Profile from "./components/Profile";

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
            <Route path="/" element={<Feeds />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
