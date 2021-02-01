export const projectModifier = (_projects) => {
    const projects = [..._projects];
    projects.forEach((project, index) => {
      const _project = {
        ...project,
      };
  
      delete _project.signingKeyId;
      delete _project.radiksSignature;
      projects[index] = _project;
    });
    return projects;
  };