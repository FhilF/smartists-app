import React from "react";
import { Route } from "react-router-dom";
import FAQs from "../pages/FAQs";
import Guides from "pages/Guides";
import Artists from "pages/Guides/Artists";
import ArtUser from "pages/Guides/ArtUser";

const globalRoutes = [
  <Route path="/guides" key="/guides" element={<Guides />} />,
  <Route path="/guides/artist-guide" key="/guides/artist-guide" element={<Artists />} />,
  <Route path="/guides/art-user-guide" key="/guides/art-user-guide" element={<ArtUser />} />,
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
