import React, { Component } from "react";
import Button from "../customComponents/Button";
import { connect } from "react-redux";
import ImagePlaceHolder from "../assets/images/mountain-placeholder.jpg";
import placeHolder from "../assets/images/avatar-placeholder.png";

import SmartistsMemberCard from "../components/SmartistsMemberCard";

import {
  fetchSmartistsMembers,
  clearSmartistsMembers,
} from "../utils/actions/smartistsMemberAction";

export class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  componentDidMount() {
    const { fetchSmartistsMembers, fetchedSmartistsMembers } = this.props;
    this.setState({ isLoading: true });
    if (fetchedSmartistsMembers.length === 0) {
      const query = { isArtist: true };
      fetchSmartistsMembers(query);
    }
    this.setState({ isLoading: false });
  }
  render() {
    const { isLoading } = this.state;
    const { fetchedSmartistsMembers, loadingSmartistsMembers } = this.props;
    return (
      <Content
        isLoading={isLoading}
        fetchedSmartistsMembers={fetchedSmartistsMembers}
        loadingSmartistsMembers={loadingSmartistsMembers}
      />
    );
  }
}

function Content(props) {
  const { isLoading, fetchedSmartistsMembers, loadingSmartistsMembers } = props;
  return (
    <div>
      <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="text-center mt-40">
          <h1 className="text-5xl text-gray-800">Welcome to smartists!</h1>
          <h4 className="mt-8 text-gray-400">
            Set up your account to introduce yourself and connect with
            self-managed artists!
          </h4>
          <div className="mt-10 flex flex-col items-center">
            <Button
              link="/account-setup"
              color="secondary"
              variant="contained"
              size="large"
              style={{ borderRadius: "20px" }}
            >
              Start Now
            </Button>
            <Button className="mt-5" link={"/documentation"}>
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <div className="w-full lg:max-w-2xl">
            {!isLoading && !loadingSmartistsMembers ? (
              <>
                {fetchedSmartistsMembers.map((el, i) => {
                  return <SmartistsMemberCard key={i} smartistsMember={el} />;
                })}
              </>
            ) : (
              <>loading</>
            )}
          </div>
        </div>

        {/* {loading ? (
          <>Loading</>
        ) : (
          <div
            style={{
              backgroundImage: `url(${URL.createObjectURL(
                new Blob([new Uint8Array(sample)])
              )})`,
              width: "250px",
              height: "250px",
            }}
          ></div>
        )} */}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  fetchedSmartistsMembers: state.smartistsMemberReducer.smartistsMembers,
  loadingSmartistsMembers: state.smartistsMemberReducer.loadingSmartistsMembers,
  errorSmartistsMembers: state.smartistsMemberReducer.errorSmartistsMembers,
});
export default connect(mapStateToProps, {
  fetchSmartistsMembers,
  clearSmartistsMembers,
})(Welcome);
