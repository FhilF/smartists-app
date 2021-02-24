import React, { Component, useState, useEffect } from "react";

import FeaturedArtworkModel from "models/FeaturedArtwork";
import FeaturedArtworkComponent from "components/FeaturedArtwork";
import AddFeaturedArtworkComponent from "components/FeaturedArtwork/Add";
import { getMediaFile } from "lib/media";

import { useBlockstack } from "react-blockstack";
import { connect } from "react-redux";
import { useAlert } from "react-alert";
import {
  fetchFeaturedArtwork,
  clearFeaturedArtwork,
} from "utils/actions/featuredArtworkAction";
import { MdThumbsUpDown } from "react-icons/md";

class FeaturedArtwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingFeaturedArtwork: true,
      isModifyingFeaturedArtwork: false,
      featuredArtworks: [],
    };
  }

  handleAdd = (singleArtwork) => {
    this.setState({ isModifyingFeaturedArtwork: true });
    const { smartistsMember } = this.props;
    getMediaFile(smartistsMember.username, singleArtwork.attrs.media.fileName)
      .then((value) => {
        if (value) {
          singleArtwork.attrs.media.file = value;
        } else {
          singleArtwork.attrs.media.file = null;
        }
        // delete el.attrs.media["fileName"];
        return singleArtwork;
      })
      .then((res) => {
        this.setState({
          featuredArtworks: [...this.state.featuredArtworks, res],
          isModifyingFeaturedArtwork: false,
        });
      });
  };

  handleDeleteUpdateList = (index) => {
    this.setState({ isModifyingFeaturedArtwork: true });
    const { featuredArtworks } = this.state;
    var arrays = [...featuredArtworks]; // make a separate copy of the array
    arrays.splice(index, 1);
    this.setState({
      featuredArtworks: arrays,
      isModifyingFeaturedArtwork: false,
    });
  };

  handleFeaturedArtwork = () => {
    this.setState({ isFetchingFeaturedArtwork: true });
    const { smartistsMember, isUser, fetchFeaturedArtwork } = this.props;
    if (isUser) {
      FeaturedArtworkModel.fetchOwnList()
        .then((result) => {
          if (result.length > 3) {
            result = result.splice(0, 3);
          }
          if (result.length !== 0) {
            return Promise.all(
              result.map(async (el, i) => {
                return getMediaFile(
                  smartistsMember.username,
                  el.attrs.media.fileName
                ).then((value) => {
                  if (value) {
                    el.attrs.media.file = value;
                  } else {
                    el.attrs.media.file = null;
                  }
                  // delete el.attrs.media["fileName"];
                  return el;
                });
              })
            );
          } else {
            return [];
          }
        })
        .then((result) => {
          this.setState({
            featuredArtworks: result,
            isFetchingFeaturedArtwork: false,
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ isFetchingFeaturedArtwork: false });
        });
    } else {
      const query = {
        studioId: smartistsMember.studio._id,
      };
      fetchFeaturedArtwork(query, smartistsMember.studio.username);
      this.setState({ isFetchingFeaturedArtwork: false });
    }
  };

  componentDidMount() {
    this.handleFeaturedArtwork();
  }

  componentWillUnmount() {}
  render() {
    const {
      isFetchingFeaturedArtwork,
      featuredArtworks,
      isModifyingFeaturedArtwork,
    } = this.state;
    const {
      smartistsMember,
      isUser,
      match,
      loadingFeaturedArtwork,
      fetchedFeaturedArtwork,
    } = this.props;
    return (
      <>
        <Content
          featuredArtworks={featuredArtworks}
          isFetchingFeaturedArtwork={isFetchingFeaturedArtwork}
          isModifyingFeaturedArtwork={isModifyingFeaturedArtwork}
          handleAdd={this.handleAdd}
          handleFeaturedArtwork={this.handleFeaturedArtwork}
          handleDeleteUpdateList={this.handleDeleteUpdateList}
          smartistsMember={smartistsMember}
          isUser={isUser}
          match={match}
          loadingFeaturedArtwork={loadingFeaturedArtwork}
          fetchedFeaturedArtwork={fetchedFeaturedArtwork}
        />
      </>
    );
  }
}

const Content = (props) => {
  const {
    featuredArtworks,
    isFetchingFeaturedArtwork,
    isModifyingFeaturedArtwork,
    handleAdd,
    handleFeaturedArtwork,
    handleDeleteUpdateList,
    smartistsMember,
    isUser,
    match,
    loadingFeaturedArtwork,
    fetchedFeaturedArtwork,
  } = props;
  const { userSession } = useBlockstack();

  const alert = useAlert();
  return (
    <div>
      <div className="mt-12">
        <div className="flex items-center">
          <p className="text-gray-700 text-3xl flex-grow">Featured Artworks</p>
          <div>
            {isUser && !isFetchingFeaturedArtwork && (
              <AddFeaturedArtworkComponent
                userSession={userSession}
                userStudio={smartistsMember.studio.attrs}
                featuredArtworks={featuredArtworks}
                handleFeaturedArtwork={handleFeaturedArtwork}
                handleAdd={handleAdd}
                isModifyingFeaturedArtwork={isModifyingFeaturedArtwork}
              />
            )}
          </div>
        </div>
        <div className="mt-12">
          {isUser ? (
            !isFetchingFeaturedArtwork ? (
              featuredArtworks.length !== 0 ? (
                <div className="grid grid-cols-3 gap-8">
                  {featuredArtworks.map((el, i) => {
                    return (
                      <FeaturedArtworkComponent
                        key={i}
                        featuredArtwork={el}
                        isUser={isUser}
                        userSession={userSession}
                        handleDeleteUpdateList={handleDeleteUpdateList}
                        isModifyingFeaturedArtwork={isModifyingFeaturedArtwork}
                        index={i}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-2xl text-gray-300">
                    No featured artworks yet
                  </p>
                </div>
              )
            ) : (
              <>Loading</>
            )
          ) : null}

          {!isUser ? (
            !isFetchingFeaturedArtwork ? (
              !loadingFeaturedArtwork ? (
                <div className="grid grid-cols-3 gap-8">
                  {fetchedFeaturedArtwork.map((el, i) => {
                    return (
                      <FeaturedArtworkComponent
                        key={i}
                        featuredArtwork={el}
                        isUser={isUser}
                      />
                    );
                  })}
                </div>
              ) : null
            ) : null
          ) : null}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  fetchedFeaturedArtwork: state.featuredArtworkReducer.featuredArtwork,
  loadingFeaturedArtwork: state.featuredArtworkReducer.loadingFeaturedArtwork,
  errorFeaturedArtwork: state.featuredArtworkReducer.errorFeaturedArtwork,
});
export default connect(mapStateToProps, {
  fetchFeaturedArtwork,
  clearFeaturedArtwork,
})(FeaturedArtwork);
