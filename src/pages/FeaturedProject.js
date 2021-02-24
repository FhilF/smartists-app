import React, { useState, useEffect, Component } from "react";

import ProjectModel from "models/Project";
import FeaturedProjectComponent from "components/Project";
import AddFeaturedProject from "components/Project/Add";
import { getMediaFile } from "lib/media";

import { useBlockstack } from "react-blockstack";
import { connect } from "react-redux";
import { useAlert } from "react-alert";
import { fetchProject, clearProject } from "utils/actions/projectAction";

import Single from "../components/Project/Single";
import View from "../components/Project/View";

class FeaturedProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingProject: true,
      isModifyingProject: false,
      projects: [],
      viewProject: { index: null, data: {} },
    };
  }

  handleAdd = (singleProject) => {
    this.setState({ isModifyingProject: true });
    const { smartistsMember } = this.props;
    getMediaFile(smartistsMember.username, singleProject.attrs.fileName)
      .then((value) => {
        if (value) {
          singleProject.attrs.file = value;
        } else {
          singleProject.attrs.file = null;
        }
        // delete el.attrs.media["fileName"];
        return singleProject;
      })
      .then((res) => {
        this.setState({
          projects: [...this.state.projects, res],
          isModifyingProject: false,
        });
      });
  };

  handleDeleteUpdateList = (index) => {
    this.setState({ isModifyingProject: true });
    const { projects } = this.state;
    var arrays = [...projects]; // make a separate copy of the array
    arrays.splice(index, 1);
    this.setState({
      projects: arrays,
      isModifyingProject: true,
      viewProject: {},
    });
  };

  handlePreview = (index, projectForViewing) => {
    this.setState({ viewProject: { index: index, data: projectForViewing } });
  };

  handleProjectUpdate = (index, newProject) => {
    this.setState({ isModifyingProject: true });
    const { smartistsMember } = this.props;
    getMediaFile(smartistsMember.username, newProject.attrs.fileName)
      .then((value) => {
        if (value) {
          newProject.attrs.file = value;
        } else {
          newProject.attrs.file = null;
        }
        // delete el.attrs.media["fileName"];
        return newProject;
      })
      .then((res) => {
        const newArray = this.state.projects;
        newArray[index] = res;
        this.setState({
          project: newArray,
          viewProject: { index: index, data: res },
          isModifyingProject: false,
        });
      });
  };

  handleProject = () => {
    this.setState({ isFetchingProject: true });
    const { smartistsMember, isUser, fetchProject } = this.props;
    if (isUser) {
      ProjectModel.fetchOwnList()
        .then((result) => {
          if (result.length !== 0) {
            return Promise.all(
              result.map(async (el, i) => {
                return getMediaFile(
                  smartistsMember.username,
                  el.attrs.fileName
                ).then((value) => {
                  if (value) {
                    el.attrs.file = value;
                  } else {
                    el.attrs.file = null;
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
          console.log(result);
          this.setState({
            projects: result,
            isFetchingProject: false,
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ isFetchingProject: false });
        });
    } else {
      const query = {
        studioId: smartistsMember.studio._id,
      };
      fetchProject(query, smartistsMember.studio.username);
      this.setState({ isFetchingProject: false });
    }
  };

  componentDidMount() {
    this.handleProject();
  }
  render() {
    const {
      isFetchingProject,
      isModifyingProject,
      projects,
      viewProject,
    } = this.state;
    const {
      isUser,
      smartistsMember,
      loadingProject,
      fetchedProject,
    } = this.props;
    return (
      <>
        <Content
          isUser={isUser}
          isFetchingProject={isFetchingProject}
          projects={projects}
          smartistsMember={smartistsMember}
          handleAdd={this.handleAdd}
          isModifyingProject={isModifyingProject}
          handleDeleteUpdateList={this.handleDeleteUpdateList}
          handlePreview={this.handlePreview}
          viewProject={viewProject}
          handleProjectUpdate={this.handleProjectUpdate}
          loadingProject={loadingProject}
          fetchedProject={fetchedProject}
        />
      </>
    );
  }
}

const Content = (props) => {
  const {
    isUser,
    isFetchingProject,
    projects,
    smartistsMember,
    handleAdd,
    isModifyingProject,
    handleDeleteUpdateList,
    handlePreview,
    viewProject,
    handleProjectUpdate,
    loadingProject,
    fetchedProject,
  } = props;

  const { userSession } = useBlockstack();

  const [viewProjectCopy, setViewProjectCopy] = useState({
    index: null,
    data: {},
  });

  const [viewUserProject, setViewUserProject] = useState({});


  const [handleDialog, setHandleDialog] = useState(false);

  const handleModalOpen = (data) => {
    document.body.style.overflow = "hidden";
    setViewUserProject(data);
    setHandleDialog(true);
  };

  const handleModalClose = () => {
    document.body.style.overflow = "visible";
    setHandleDialog(false);
    setViewUserProject({});
  };

  useEffect(() => {
    if (typeof viewProject.data === "object" && viewProject.data !== null) {
      if (viewProject.index !== null) {
        setViewProjectCopy({
          index: viewProject.index,
          data: Object.assign({}, viewProject.data),
        });
      }
    }
  }, [viewProject]);

  useEffect(() => {}, [viewProjectCopy]);

  return (
    <div>
      <div className="mt-12 flex justify-center">
        <div className="md:max-w-screen-md w-full">
          <div className="flex items-center">
            <p className="text-gray-700 text-3xl flex-grow">
              Projects in progress looking for collaborators
            </p>
            <div>
              {isUser && !isFetchingProject && (
                <AddFeaturedProject
                  userSession={userSession}
                  userStudio={smartistsMember.studio.attrs}
                  handleAdd={handleAdd}
                  isModifyingProject={isModifyingProject}
                />
              )}
            </div>
          </div>
          <div className="mt-12">
            {handleDialog && !isFetchingProject && (
              <View handleModal={handleModalClose} project={viewUserProject} isUser={isUser} />
            )}
            {isUser ? (
              !isFetchingProject ? (
                projects.length !== 0 ? (
                  <>
                    {viewProjectCopy.index !== null ? (
                      <Single
                        userSession={userSession}
                        handlePreview={handlePreview}
                        viewProject={viewProject}
                        isUser={isUser}
                        handleDeleteUpdateList={handleDeleteUpdateList}
                        handleProjectUpdate={handleProjectUpdate}
                        viewProjectCopy={viewProjectCopy}
                        setViewProjectCopy={setViewProjectCopy}
                        isModifyingProject={isModifyingProject}
                      />
                    ) : (
                      <div>
                        {projects.map((el, i) => {
                          return (
                            <FeaturedProjectComponent
                              key={i}
                              project={el}
                              isModifyingProject={isModifyingProject}
                              isUser={isUser}
                              viewProject={viewProject}
                              handlePreview={handlePreview}
                              index={i}
                              handleModalOpen={handleModalOpen}
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-2xl text-gray-300">No projects yet</p>
                  </div>
                )
              ) : (
                <>Loading</>
              )
            ) : null}

            {!isUser ? (
              !isFetchingProject ? (
                !loadingProject ? (
                  fetchedProject.length !== 0 ? (
                    <>
                      {viewProjectCopy.index !== null ? (
                        <Single
                          handlePreview={handlePreview}
                          viewProject={viewProject}
                          isUser={isUser}
                        />
                      ) : (
                        <div>
                          {fetchedProject.map((el, i) => {
                            return (
                              <FeaturedProjectComponent
                                key={i}
                                project={el}
                                isUser={isUser}
                                viewProject={viewProject}
                                handlePreview={handlePreview}
                                index={i}
                                handleModalOpen={handleModalOpen}
                              />
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-2xl text-gray-300">No projects yet</p>
                    </div>
                  )
                ) : (
                  <>Loading</>
                )
              ) : (
                <>Loading</>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  fetchedProject: state.projectReducer.project,
  loadingProject: state.projectReducer.loadingProject,
  errorProject: state.projectReducer.errorProject,
});

export default connect(mapStateToProps, { fetchProject })(FeaturedProject);
