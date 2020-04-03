import * as React from "react";
import { Helmet } from "react-helmet-async";

const Wrapper = ({ children, doc }) => (
  <React.Fragment>
    <Helmet>
      <script src="https://embed.runkit.com"></script>
    </Helmet>
    {children}
  </React.Fragment>
);
export default Wrapper;
