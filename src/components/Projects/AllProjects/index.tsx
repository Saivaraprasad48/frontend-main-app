import { FC } from 'react';
import styles from './index.module.scss';
import Card from 'components/Card';
import ProjectCard from 'components/Home/ProjectCard';
import getRandomString from 'utils/getRandomString';

interface AllProjectsProps {
  projectData: any;
}

const AllProjects: FC<AllProjectsProps> = ({ projectData }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Projects</h1>
      <Card className={styles.cardsContainer}>
        <>
          {projectData.map((project: any) => {
            return (
              <ProjectCard
                key={getRandomString(5)}
                projectId={project.flProjectId}
                projectName={project.flProjectName}
                org={project.organisationName}
                description={project.flProjectDescription}
                numTasks={project.taskCount}
                location="Project"
                width=''
              />
            );
          })}
        </>
      </Card>
    </div>
  );
};

export default AllProjects;