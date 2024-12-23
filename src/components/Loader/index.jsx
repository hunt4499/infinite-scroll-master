import React from "react";
import { css } from "@emotion/core";
import PuffLoader from "react-spinners/PuffLoader";
 
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
 
class AwesomeLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
 
  render() {
    return (
      <div className="sweet-loading">
        <PuffLoader

          css={override}
          size={70}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default AwesomeLoader;