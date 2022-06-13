import React from "react";
import { Route } from "react-router-dom";
import FAQs from "../pages/FAQs";
import Guides from "pages/Guides";
import CreateAccount from "pages/Guides/CreateAccount";

const globalRoutes = [
  <Route path="/guides" key="/guides" element={<Guides />} />,
  <Route path="/guides/create-account-on-smartists" key="/guides/create-account-on-smartists" element={<CreateAccount />} />,
  <Route path="/faqs/:id" key="/documentation" element={<FAQs />} />,
  <Route path="/faqs" key="/documentation" element={<FAQs />} />,
];

export default globalRoutes;

// function Global(props) {
//   const {} = props;
//   return (
//     <>
//       <Route
//         exact
//         path="/privacy-policy"
//         Component
//         render={(routeProps) => <PrivacyPolicy {...routeProps} />}
//       />
//     </>
//   );
// }
