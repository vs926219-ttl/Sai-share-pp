/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Box } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from './WarningModal.module.css';

const WarningModal = ({  handleClose, open, confirmDelete }) => (
		<Modal open={open} onClose={handleClose}>
			<div className={styles.container}>
				<div className={styles.title}>
					<span>
						{' '}
						<DeleteIcon className={styles.block} fontSize="1rem" />
					</span>

					<span className={styles.txt}>Delete</span>
				</div>
				<Box bgcolor="#dadada3d" marginTop="13px" height="75px" marginLeft="9px">
					<p className={styles.warningText}>
						Are you sure you want to delete it? Once deleted
                        it cannot be recovered.
					</p>
				</Box>
				<div className={styles.bottomRow}>
					<button className={styles.cancelBt} onClick={handleClose}>
						CANCEL
					</button>
					<span>
						<button
								onClick={() => {
									handleClose();
									confirmDelete();
						
							}}
							className={styles.submitBt}
						>
							YES
						</button>
					</span>
				</div>
			</div>
		</Modal>
	);

WarningModal.propTypes = {
	confirmDelete: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
};

export default WarningModal;
