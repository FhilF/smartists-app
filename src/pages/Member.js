import React, { Component, useEffect } from "react";
import placeHolder from "../assets/images/avatar-placeholder.png";
import Button from "../customComponents/Button";
import { some, isEmpty, isNil, get, isBoolean } from "lodash";

export class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingMember: true,
      isModifyingMember: false,
      member: [],
      isUser: null,
    };
  }

  componentDidMount() {
    this.setState({ isFetchingMember: true });
    const { match, smartistsUser } = this.props;
    if (match.params.username === smartistsUser[0].attrs.username) {
      this.setState({
        isUser: true,
        member: smartistsUser,
        isFetchingMember: false,
      });
    } else {
      this.setState({ isUser: false, isFetchingMember: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.setState({ isFetchingMember: true });
      const { match, smartistsUser } = this.props;
      if (match.params.username === smartistsUser[0].attrs.username) {
        this.setState({
          isUser: true,
          member: smartistsUser,
          isFetchingMember: false,
        });
      } else {
        this.setState({ isUser: false, isFetchingMember: false });
      }
    }
  }
  
  render() {
    const { isFetchingMember, member, isUser } = this.state;

    const { match, smartistsUser, history } = this.props;
    return (
      <>
        <Content
          isUser={isUser}
          member={member}
          isFetchingMember={isFetchingMember}
          match={match}
          history={history}
        />
      </>
    );
  }
}

function Content(props) {
  const { isFetchingMember, member, isUser, match, history } = props;

  const getData = (value) => {
    if (!isFetchingMember) {
      if (isUser) {
        return get(member[0].attrs, value);
      } else {
        if (member.length !== 0) {
        } else {
          return "--";
        }
      }
    } else {
      return "--";
    }
  };

  const getUserInfo = () => {
    if (!isFetchingMember) {
      if (isUser) {
        return true;
      } else {
        if (member.length !== 0) {
          return true;
        } else {
          return "No Data";
        }
      }
    } else {
      return false;
    }
  };

  return (
    <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
      <div className="flex justify-center">
        <div className="w-full pl-4 pr-4 sm:p-0">
          <div className="flex justify-center relative mt-8">
            <div className="w-28 h-28 relative">
              <div
                style={{
                  backgroundImage: `url(${placeHolder})`,
                }}
                className="h-full w-full rounded-full bg-center bg-cover border-gray-400 border cursor-pointer"
              ></div>
            </div>
            <div className="absolute top-1 right-1">
              <Button link={`/studio/${getData("username")}`}>
                View Studio
              </Button>
              {isUser && (
                <Button
                  variant="contained"
                  color="secondary"
                  link={`${getData("username")}/edit`}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            {!isNil(getData("name")) ? (
              <p className="font-normal text-xl text-gray-800">
                {getData("name")}
              </p>
            ) : (
              "Anoynymous Person"
            )}

            <p className="font-normal text-sm text-gray-600 mt-1">
              @{getData("username")}
            </p>

            {!isNil(getData("websiteUrl")) && getData("websiteUrl") !== "--" ? (
              <div className="mt-4">
                <p className="font-normal text-xs text-gray-400">Website</p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getData("websiteUrl")}
                  className="cursor-pointer text-secondary underline text-sm"
                >
                  {getData("websiteUrl")}
                </a>
              </div>
            ) : null}

            {!isNil(getData("description")) &&
            getData("description") !== "--" ? (
              <div className="flex justify-center mt-4">
                <div className="w-full lg:w-9/12 text-center">
                  <p className="font-normal text-xs text-gray-500">
                    {getData("description")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          {getUserInfo() ? (
            getUserInfo() !== "No Data" ? (
              <MemberInfo member={member} isUser={isUser} match={match} />
            ) : (
              <div className="flex justify-center">
                <div className="text-center mt-8 xl:w-2/5">
                  <h4 className="font-semibold text-xl">
                    The member you're searching hasn't set up his/her account or
                    doesn't exist
                  </h4>
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MemberInfo(props) {
  const { member, isUser } = props;
  const smartistsUser = isUser ? member[0].attrs : member;
  return (
    <div className="flex justify-center">
      <div className="mt-8 w-full sm:w-10/12 md:w-2/4 lg:w-2/4 xl:w-2/6">
        {smartistsUser.isArtist.boolean ? (
          <div className="card w-full rounded-lg">
            <div className="p-4 pb-6 text-center">
              <h5 className="font-semibold text-base text-secondary">
                Artist Info
              </h5>
              <div className="mt-4">
                <div>
                  <p className="font-normal text-sm text-gray-400">Skills</p>
                  <ul className="mt-2 ">
                    {smartistsUser.isArtist.info.skills.map((el, i) => {
                      return (
                        <li
                          key={i}
                          className="font-semibold text-sm text-gray-600"
                        >
                          {el}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="font-normal text-sm text-gray-400">
                    Open to work on demand:
                    <span>
                      &nbsp;
                      {smartistsUser.isArtist.info.openWork ? (
                        <>&#10004;</>
                      ) : (
                        <>&#10060;</>
                      )}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {smartistsUser.isArtist.boolean && smartistsUser.isArtUser.boolean && (
          <div className="mt-4"></div>
        )}

        {smartistsUser.isArtUser.boolean ? (
          <div className="card w-full rounded-lg">
            <div className="p-4 pb-6 text-center">
              <h5 className="font-semibold text-base  text-secondary">
                Art user info
              </h5>
              <div className="mt-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Major Interest:
                    <span className="text-gray-600 font-semibold ">
                      &nbsp;{smartistsUser.isArtUser.info.majorInterest}
                    </span>
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-normal text-sm text-gray-400">
                    Primary Interest
                  </p>
                  <ul className="mt-2 ">
                    {smartistsUser.isArtUser.info.primaryInterest.map(
                      (el, i) => {
                        return (
                          <li
                            key={i}
                            className="font-semibold text-sm text-gray-600"
                          >
                            {el}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Member;
