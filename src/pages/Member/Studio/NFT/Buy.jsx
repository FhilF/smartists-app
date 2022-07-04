import React, { useState } from "react";
import StxIcon from "assets/images/stx-icon.png";
import classNames from "classnames";
import { Oval } from "react-loader-spinner";
import LicensingAgreements from "components/LicensingAgreement";

function Buy(props) {
  const { isBuyingPendingTx, contractBuy, alert } = props;

  const [showTerms, setShowTerms] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState({
    ag1: false,
    ag2: false,
  });
  return (
    <>
      <li
        className={classNames(
          "p-2 flex items-center",
          isBuyingPendingTx ? "bg-gray-200" : "hover:bg-gray-100 cursor-pointer"
        )}
        onClick={() => {
          if (isBuyingPendingTx) {
            return true;
          }
          setShowTerms(true);
          //   contractBuy();
        }}
      >
        <span>
          <img src={StxIcon} alt="Stacks Icon" height={24} width={24} />
        </span>
        <span className="ml-4 text-gray-600 font-medium flex-1">
          {isBuyingPendingTx ? "Buy Pending..." : "Buy"}
        </span>
        <span>
          {isBuyingPendingTx ? (
            <Oval
              ariaLabel="loading-indicator"
              height={24}
              width={24}
              strokeWidth={5}
              strokeWidthSecondary={1}
              color="blue"
              secondaryColor="gray"
              className="mr-8"
            />
          ) : null}
        </span>
      </li>
      <LicensingAgreements
        setAgreedToTerms={setAgreedToTerms}
        agreedToTerms={agreedToTerms}
        showTerms={showTerms}
        setShowTerms={setShowTerms}
        modalOnly={true}
        alert={alert}
        continueFn={contractBuy}
        text="I agree to the Licensing terms and Conditions that apply to the use of this artwork file."
      />
    </>
  );
}

export default Buy;
