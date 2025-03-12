import axios from "axios";
import { BASE_URL } from "../utils/constants";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const userData = useSelector((store) => store.user);

  const hanldePayNow = async () => {
    const details = {
      membershipType: "gold",
    };

    try {
      const orderResponse = await axios.post(
        BASE_URL + "/payment/create-order",
        details,
        { withCredentials: true }
      );

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

      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          // This will be true when there is any error during the payment
          console.log("There is some payment error, Check for Payment Status");
          console.log(result.error);
        }
        if (result.redirect) {
          // This will be true when the payment redirection page couldnt be opened in the same window
          // This is an exceptional case only when the page is opened inside an inAppBrowser
          // In this case the customer will be redirected to return url once payment is completed
          console.log("Payment will be redirected");
        }
        if (result.paymentDetails) {
          // This will be called whenever the payment is completed irrespective of transaction status
          console.log("Payment has been completed, Check for Payment Status");
          console.log(result.paymentDetails.paymentMessage);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {userData && <EditProfile data={userData} />}

      <button
        className="btn btn-primary bg-red-500"
        onClick={() => hanldePayNow()}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Profile;
