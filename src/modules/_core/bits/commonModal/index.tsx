import { createPortal } from 'react-dom';
import { MouseEventHandler, useState } from 'react';

import { CloseIcon } from '~/icons';
import { ModalWrapper } from '~/modules/_core/styles/ModalWrapper';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  function toggle() {
    setIsOpen(!isOpen);
  }
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return {
    isOpen,
    toggle,
    openModal,
    closeModal,
  };
};

interface ICommonModalProps {
  isOpen: boolean;
  content: any;
  closeIcon?: any;
  closeModal: MouseEventHandler;
  width?: string;
}

const Modal = ({ isOpen, content, closeIcon, closeModal, width = 'fit-content' }: ICommonModalProps) => {
  // const ref = useRef();

  // useEffect(() => {
  //   ref.current = document.querySelector('#modal');
  // }, [isOpen]);

  return isOpen
    ? createPortal(
        <ModalWrapper width={width} id="modal">
          <div className="modelWrapper" onClick={closeModal}>
            <div
              className="modal__content"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {content}
              {closeIcon &&
                (typeof closeIcon === 'boolean' ? (
                  <div className="close--btn" onClick={closeModal}>
                    <CloseIcon />
                  </div>
                ) : (
                  <div className="close--btn" onClick={closeModal}>
                    {closeIcon}
                  </div>
                ))}
            </div>
          </div>
        </ModalWrapper>,
        document.body,
      )
    : null;
};

export { Modal, useModal };
