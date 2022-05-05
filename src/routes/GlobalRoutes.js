import React from "react";
import { Route } from "react-router-dom";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Documentation from "../pages/Documentation";

const GlobalRoutes = [
  <Route path="/privacy-policy" key="/privacy-policy" element={<PrivacyPolicy />} />,
  <Route path="/documentation" key="/documentation" element={<Documentation />} />,
];

export default GlobalRoutes;

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
