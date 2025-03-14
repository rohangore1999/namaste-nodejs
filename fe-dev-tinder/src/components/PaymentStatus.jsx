import { useEffect } from "react";
import axios from "axios";

// Constants
import { BASE_URL } from "../utils/constants";

const PaymentStatus = () => {
  const getPaymentStatus = async () => {
    try {
      // checking if in queryParam order_id present
      const urlParams = new URLSearchParams(window.location.search);
      const myOrderId = urlParams.get("orderId");

      const res = await axios.get(BASE_URL + `/payment/status?orderId=${myOrderId}`, {
        withCredentials: true,
      });

      console.log(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPaymentStatus();
  }, []);

  return <div>PaymentStatus</div>;
};

export default PaymentStatus;
