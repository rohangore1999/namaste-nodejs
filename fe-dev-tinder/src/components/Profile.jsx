import axios from "axios";
import { useSelector } from "react-redux";

// Components
import EditProfile from "./EditProfile";

// Constants
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const userData = useSelector((store) => store.user);

  const hanldePayNow = async () => {
    const details = {
      membershipType: "gold",
    };

    try {
      const orderResponse = await axios.post(BASE_URL + "/payment/create-order", details, {
        withCredentials: true,
      });

      // open cashfree dialog box on success of order response.
      // when the app will load, the Cashfree script will get load and Cashfree object will be preset in the window object.
      // https://www.cashfree.com/docs/payments/online/web/redirect
      const cashfree = window.Cashfree({
        mode: "sandbox",
      });

      let checkoutOptions = {
        paymentSessionId: orderResponse?.data?.payment_session_id,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   // checking if in queryParam order_id present
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const myOrderId = urlParams.get("order-id");

  //   if (!myOrderId) return;

  //   // if present then fetch the user data
  //   window.Cashfree.PGFetchOrder("2023-08-01", myOrderId)
  //     .then((response) => {
  //       console.log("Order fetched successfully:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error.response.data.message);
  //     });
  // }, []);

  return (
    <div>
      {userData && <EditProfile data={userData} />}

      <button className="btn btn-primary bg-red-500" onClick={() => hanldePayNow()}>
        Pay Now
      </button>
    </div>
  );
};

export default Profile;
