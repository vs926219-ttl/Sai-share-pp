/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CustomSelect } from '../../FormComponents';
import styles from './ProcessToolbar.module.css'
import { API_RESOURCE_URLS, RESOURCE_TYPE, USER_OPERATIONS } from '../../../constants';
import { API } from '../../../apis/api';
import { buildErrorMessage } from '../../../apis/calls';
import { withAllowedOperationsProvider } from '../../../hocs';
import { AuthChecker } from '../../../atomicComponents';

function ProcessToolbar({
  inputFields,
  ppap,
  highlightMandatoryFields,
  dispatch,
  hambugerOpen
}) {

  const { _links: links, requirement } = ppap || {};
  const { _links: requirementLinks } = requirement || {};
  const isPpapInitiated = !!(links?.initiate || (requirement && requirementLinks?.initiate));
  const isPpapTerminated = links?.terminate
  const disableSelect = !isPpapInitiated || !isPpapTerminated;
  const ppapReasons = ppap?.reason?.reason;

  const [availablePartCategories, setAvailablePartCategories] = useState({ loading: false, data: [] });
  const [availableOverwritePpapLevels, setAvailableOverwritePpapLevels] = useState({ loading: false, data: [] });

  const [hover, setHover] = useState({ isHover: false, name: null });
  const onHover = (name) => {
    setHover({ isHover: true, name });
  };
  const onLeave = () => {
    setHover({ isHover: false, name: null });
  };

  const {
    partCategory,
    partCategoryDescription,
    systemPpapLevel,
    systemPpapLevelDescription,
    overwritePpapLevel,
  } = inputFields;

  const formatOptionsForSelect = (...options) =>
    options.map((option) => ({ value: option, label: option }));

  const getPartCategoryOptions = () =>
    formatOptionsForSelect(...availablePartCategories.data.map(({ name }) => name));

  const getSystemPpapLevelOptions = () => {
    if (partCategory && partCategory.value) {
      if (availablePartCategories.data && availablePartCategories.data.length) {
        const { ppapSubmissionLevels } = availablePartCategories.data
          .find(({ name }) => name === partCategory?.value);
        return formatOptionsForSelect(...ppapSubmissionLevels.map(({ level }) => level))
      }
      return [];
    }
    return [];
  }

  const getOverwritePpapLevelOptions = () =>
    formatOptionsForSelect(...availableOverwritePpapLevels.data.map(({ level }) => level))

  const loadFormData = async (setState, url, params) => {
    try {
      const response = await API.get(url, {
        params,
      });
      setState({ loading: false, data: response.data });
    } catch (error) {
      console.error(buildErrorMessage(error));
    }
  };

  const loadPartCategories = async () =>
    loadFormData(setAvailablePartCategories, API_RESOURCE_URLS.PART_CATEGORIES)

  const loadOverwritePpapLevels = async () =>
    loadFormData(setAvailableOverwritePpapLevels, API_RESOURCE_URLS.PPAP_SUBMISSIONLEVELS)

  useEffect(() => {
    loadPartCategories();
    loadOverwritePpapLevels();
  }, [])

  const getPartDescirption=()=>{
  const {description} = availablePartCategories.data.find(
    ({ name }) => name === partCategory?.label
  );
  return description;
  }

  useEffect(() => {
    if (ppap && ppap.id) {
      const { partCategory: category, level, overriddenLevel, reason } =
        requirement || {};

      dispatch({
        type: "update",
        field: "partCategory",
        value: category
          ? {
            value: category.name,
            label: category.name,
          }
          : null,
      });

      dispatch({
        type: 'update',
        field: 'partCategoryDescription',
        value: category
          ? {
              value: category.description,
              label: category.description,
            }
          : null,
      });

      dispatch({
        type: "update",
        field: "systemPpapLevel",
        value: level
          ? {
            value: level.level,
            label: level.level,
          }
          : null,
      });

       dispatch({
         type: 'update',
         field: 'systemPpapLevelDescription',
         value: level
           ? {
               value: level.description,
               label: level.description,
             }
           : null,
       });


      dispatch({
        type: "update",
        field: "overwritePpapLevel",
        value: overriddenLevel
          ? {
            value: overriddenLevel.level,
            label: overriddenLevel.level,
          }
          : null,
      });

      dispatch({
        type: "update",
        field: "ppapReason",
        value: reason
          ? {
            value: reason.id,
            label: reason.reason,
          }
          : null,
      });
    }
  }, [ppap.id]);
  return (
		<div
			className={styles.processToolbar}
			style={{
				justifyContent: hambugerOpen ? 'space-evenly' : 'space-between',
				padding: !hambugerOpen ? '0 20px' : null,
			}}
		>
			<div className={styles.formRow}>
				<AuthChecker operation={USER_OPERATIONS.LIST_PART_CATEGORIES}>
					{(isAuthorized) => {
						const isDisabled = !isAuthorized || disableSelect;
						return (
							<>
								<label className={styles.label}>Part Category*</label>
								<div
									className={styles.hoverWrapper}
									onMouseEnter={() => onHover('part-category')}
									onMouseLeave={onLeave}
								>
									<CustomSelect
										name='part-category'
										markIfUnselected={highlightMandatoryFields}
										isDisabled={isDisabled}
										options={getPartCategoryOptions()}
										className={
											hambugerOpen ? styles.select : styles.selectHamburgerOpen
										}
										value={partCategory}
										onChange={(selection) => {
											dispatch({
												type: 'update',
												field: 'partCategory',
												value: selection,
											});
											const {
												ppapSubmissionLevels,
											} = availablePartCategories.data.find(
												({ name }) => name === selection.value
											);

											if (ppapSubmissionLevels.length === 1)
												dispatch({
													type: 'update',
													field: 'systemPpapLevel',
													value: {
														label: ppapSubmissionLevels[0].level,
														value: ppapSubmissionLevels[0].level,
													},
												});
											else
												dispatch({
													type: 'update',
													field: 'systemPpapLevel',
													value: null,
												});
										}}
									/>
									{hover.isHover &&
										hover.name === 'part-category' &&
										partCategory?.label && (
											<span className={styles.hoverText}>
												{isDisabled
													? partCategoryDescription?.label
													: getPartDescirption()}
											</span>
										)}
								</div>
							</>
						);
					}}
				</AuthChecker>
			</div>
			<div className={styles.formRow}>
				<AuthChecker operation={USER_OPERATIONS.LIST_PPAP_SUBMISSION_LEVELS}>
					{(isAuthorized) => {
						const isDisabled = !isAuthorized || disableSelect;
						return (
							<>
								<label className={styles.label}>System PPAP Level*</label>
								<div
									className={styles.hoverWrapper}
									onMouseEnter={() => onHover('system-ppap-level')}
									onMouseLeave={onLeave}
								>
									<CustomSelect
										name='system-ppap-level'
										markIfUnselected={highlightMandatoryFields}
										isDisabled={isDisabled}
										options={getSystemPpapLevelOptions()}
										className={
											hambugerOpen ? styles.select : styles.selectHamburgerOpen
										}
										value={systemPpapLevel}
										onChange={(selection) =>
											dispatch({
												type: 'update',
												field: 'systemPpapLevel',
												value: selection,
											})
										}
									/>
									{hover.isHover &&
										hover.name === 'system-ppap-level' &&
										systemPpapLevel?.label && (
											<span className={styles.hoverText}>
												{systemPpapLevelDescription?.label}
											</span>
										)}
								</div>
							</>
						);
					}}
				</AuthChecker>
			</div>
			<div className={styles.formRow}>
				<AuthChecker operation={USER_OPERATIONS.LIST_PPAP_SUBMISSION_LEVELS}>
					{(isAuthorized) => {
						const isDisabled = !isAuthorized || disableSelect;
						return (
							<>
								<label className={styles.label}>Overwrite PPAP Level</label>
								<div
									className={styles.hoverWrapper}
									onMouseEnter={() => onHover('overwrite-ppap-level')}
									onMouseLeave={onLeave}
								>
									<CustomSelect
										name='overwrite-ppap-level'
										isDisabled={isDisabled}
										isClearable
										options={getOverwritePpapLevelOptions()}
										className={
											hambugerOpen ? styles.select : styles.selectHamburgerOpen
										}
										value={overwritePpapLevel}
										hideDropDownIndicator={!!overwritePpapLevel?.label}
										onChange={(selection) =>
											dispatch({
												type: 'update',
												field: 'overwritePpapLevel',
												value: selection,
											})
										}
									/>
									{hover.isHover &&
										hover.name === 'overwrite-ppap-level' &&
										isDisabled &&
										overwritePpapLevel?.label && (
											<span className={styles.hoverText}>
												{overwritePpapLevel?.label}
											</span>
										)}
								</div>
							</>
						);
					}}
				</AuthChecker>
			</div>
			<div className={styles.formRow}>
				<label className={styles.label}>PPAP Reason*</label>
				<div
					className={styles.hoverWrapper}
					onMouseEnter={() => onHover(ppapReasons)}
					onMouseLeave={onLeave}
				>
					<div className={styles.sel1}>
						<div className={styles.ppapReason}>{ppapReasons}</div>
					</div>
					{hover.isHover && hover.name === ppapReasons && (
						<span className={styles.hoverText}>{ppapReasons}</span>
					)}
				</div>
			</div>
		</div>
	);
}

ProcessToolbar.propTypes = {
  inputFields: PropTypes.object.isRequired,
  ppap: PropTypes.object,
  highlightMandatoryFields: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  hambugerOpen: PropTypes.bool
}
export default withAllowedOperationsProvider(
  ProcessToolbar,
  RESOURCE_TYPE.PART_CATEGORY,
  RESOURCE_TYPE.PPAP_SUBMISSION_LEVEL,
  RESOURCE_TYPE.PPAP_REASON
)
