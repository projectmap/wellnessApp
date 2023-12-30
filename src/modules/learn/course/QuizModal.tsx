import Draggable from 'react-draggable';
import React, { FC, ReactNode } from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Paper, Modal } from '@mui/material';

interface Model {
  onCloseModal: () => void;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  closeModalText?: string;
  showCloseButton?: boolean;
}
const QuizModal: FC<Model> = ({
  onCloseModal,
  title,
  children,
  isOpen,
  closeModalText = 'Close',
  showCloseButton = true,
}) => {
  return (
    <Modal open={isOpen} onClose={onCloseModal} aria-labelledby="modal-post" aria-describedby="post something">
      <>
        <Paper
          sx={{
            borderRadius: '12px',
            width: '529px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          elevation={0}
        >
          {children}
        </Paper>
      </>
    </Modal>
  );
};
export { QuizModal };

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
