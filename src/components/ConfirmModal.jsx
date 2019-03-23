import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ConfirmModal = (props) => {
	const { isOpen, onRequestClose, prompt, onConfirm, onCancel } = props;
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="Confirm Delete"
			closeTimeoutMS={200}
			className="modal"
			ariaHideApp={false}>
			<h3 className="modal__title">{prompt}</h3>
			<button
				type="button"
				className="button modal__button"
				onClick={onConfirm}>
				yes
			</button>
			<button
				type="button"
				className="button modal__button"
				onClick={onCancel}>
				no
			</button>
		</Modal>
	);
};

ConfirmModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func,
	prompt: PropTypes.string.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

ConfirmModal.defaultProps = {
	onRequestClose: () => {},
};

export default ConfirmModal;
