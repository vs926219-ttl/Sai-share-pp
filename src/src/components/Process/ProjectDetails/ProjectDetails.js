/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import styles from "./ProjectDetails.module.css";
import { PPAP_STATE } from "../../../constants";

function ProjectDetails({ ppap, children }) {
  const { project, plant } = ppap;
  
  if (ppap && !ppap.id)
    return children({})

  const content = (
    <div className={styles.infoWrapper}>
      <div className={styles.blockContainer}>
        <h4
          data-testid="projectName"
          className={clsx(
            styles.projectName,
            ppap?.state === PPAP_STATE.TERMINATE && styles.terminate
          )}
        >
          {project?.name}
        </h4>
      </div>

      <div className={styles.blockContainer} style={{ paddingBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>Project Info</label>
      </div>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label>Project name: </label>
          <p>{project?.name}</p>
        </div>
        <div className={styles.formGroup}>
          <label>Project code: </label>
          <p>{project?.code}</p>
        </div>
        <div className={styles.formGroup}>
          <label>Vehicle line: </label>
          <p>{project?.vehicleLines.join(",")}</p>
        </div>
        <div className={styles.formGroup}>
          <label>Business unit: </label>
          <p>{project?.businessUnit}</p>
        </div>
        <div className={styles.formGroup}>
          <label>plant: </label>
          <p>{plant?.name}</p>
        </div>
        <div className={styles.formGroup}>
          <label>Created on: </label>
          <p>{moment(project?.createdAt).format("DD/MM/YYYY")}</p>
        </div>
      </div>
      <div className={styles.blockContainer} style={{ paddingBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>Project Milestones</label>
      </div>
      <div className={styles.row}>
        <table>
          <thead>
            <tr>
              <th>Phase</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {project?.projectMilestoneTimelines.map((row) => (
              <tr>
                <td>{row.projectMilestone?.displayName}</td>
                <td>{moment(row.timeline).format("DD/MM/YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.blockContainer} style={{ paddingBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>Project Volumes</label>
      </div>
      <div className={styles.row}>
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Year</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {project?.vehicleProjections.map((row, index) => (
              <tr>
                <td>Year {index + 1}</td>
                <td>{row.year}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ height: 30 }} />
    </div>
  );

  return children({ content })
}
ProjectDetails.propTypes = {
  ppap: PropTypes.any,
  children: PropTypes.func.isRequired
};

export default ProjectDetails;
