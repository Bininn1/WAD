import React from 'react';
import ComponentStyles from '../components/ComponentStyles';
import Framework from '../components/FrameworkSelectionModal';
import Toolbar from '../components/ProjectToolbar';
import ComponentList from '../components/ComponentList';

const ProjectCompose: React.FC = () => {
  return (
    <div>
      <ComponentList />
      <Toolbar />
      <Framework />
      <ComponentStyles />
      </div>
  );
};

export default ProjectCompose;