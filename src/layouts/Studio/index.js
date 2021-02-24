import React, { Component } from "react";
import StudioLayout from "./StudioLayout";
import StudioPage from "../../pages/Studio";

import { connect } from "react-redux";

import StudioModel from "models/Studio";
import { fetchSmartistsMember } from "utils/actions/smartistsMemberAction";
import { matches, isEmpty } from "lodash";

import AddStudio from "../../components/AddStudio";

export class Studio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPageLoading: true,
      isUser: null,
      smartistsMember: {},
    };
  }

  handleStudio = (studio) => {
    const {smartistsMember} = this.state
    this.setState({smartistsMember: {...smartistsMember, studio:studio}})
  };

  componentDidMount() {
    const {
      match,
      smartistsUser,
      fetchSmartistsMember,
      fetchedSmartistsMember,
    } = this.props;
    const usernameLink = match.params.username;
    const smartistsUserSignedIn = smartistsUser[0].attrs;

    if (usernameLink === smartistsUserSignedIn.username) {
      const smartistsMemberCopy = Object.assign({}, smartistsUserSignedIn);
      if (smartistsUserSignedIn.isArtist.boolean) {
        StudioModel.fetchOwnList().then((result) => {
          if (result.length !== 0) {
            this.setState({
              smartistsMember: { ...smartistsMemberCopy, studio: result[0] },
              isUser: true,
              isPageLoading: false,
            });
          } else {
            this.setState({
              smartistsMember: { ...smartistsMemberCopy, studio: {} },
              isUser: true,
              isPageLoading: false,
            });
          }
        });
      } else {
        this.setState({
          smartistsMember: { ...smartistsMemberCopy, studio: null },
          isUser: true,
          isPageLoading: false,
        });
      }
    } else {
      if (fetchedSmartistsMember.length === 0) {
        const query = {
          smartistsMember: usernameLink,
          studioLookup: true,
        };
        fetchSmartistsMember(query);
        this.setState({ isUser: false, isPageLoading: false });
      } else {
        this.setState({ isUser: false, isPageLoading: false });
      }
    }
  }
  render() {
    const { isPageLoading, smartistsMember, isUser } = this.state;
    const {
      history,
      match,
      location,
      loadingSmartistsMember,
      fetchedSmartistsMember,
    } = this.props;

    console.log(smartistsMember)

    return (
      <>
        {!isPageLoading &&
          isUser === true &&
          (smartistsMember.isArtist.boolean ? (
            <StudioLayout
              smartistsMember={smartistsMember}
              history={history}
              match={match}
              location={location}
              isUser={isUser}
            >
              {!isEmpty(smartistsMember.studio) ? (
                <StudioPage
                  history={history}
                  match={match}
                  location={location}
                  isUser={isUser}
                  smartistsMember={smartistsMember}
                />
              ) : (
                <AddStudio match={match} handleStudio={this.handleStudio}/>
              )}
            </StudioLayout>
          ) : (
            <div>User is not an artist</div>
          ))}

        {!isPageLoading && isUser === false && (
          <>
            {!loadingSmartistsMember ? (
              fetchedSmartistsMember.length !== 0 ? (
                fetchedSmartistsMember[0].isArtist.boolean ? (
                  !isEmpty(fetchedSmartistsMember[0].studio) ? (
                    <StudioLayout
                      smartistsMember={fetchedSmartistsMember[0]}
                      history={history}
                      match={match}
                      location={location}
                      isUser={isUser}
                    >
                      <StudioPage
                        history={history}
                        match={match}
                        location={location}
                        isUser={isUser}
                        smartistsMember={fetchedSmartistsMember[0]}
                      />
                    </StudioLayout>
                  ) : (
                    <>No studio available</>
                  )
                ) : (
                  <>not an artist</>
                )
              ) : (
                <>No member found</>
              )
            ) : null}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchedSmartistsMember: state.smartistsMemberReducer.smartistsMember,
  loadingSmartistsMember: state.smartistsMemberReducer.loadingSmartistsMember,
  errorSmartistsMember: state.smartistsMemberReducer.errorSmartistsMember,
});
export default connect(mapStateToProps, {
  fetchSmartistsMember,
  // fetchPortfolio,
  // fetchProject,
})(Studio);
