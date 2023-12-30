import { SubmitHandler, UseFormReset } from 'react-hook-form';

export interface IFormInput {
  comment: string;
}

export interface OnSubmitProps {
  data: IFormInput;
  reset: UseFormReset<IFormInput>;
}

export type CommentBoxProps =
  | {
      onSubmit: SubmitHandler<OnSubmitProps>;
      loading?: boolean;
    } & (
      | {
          edit?: never;
          prevComment?: never;
        }
      | {
          edit: boolean;
          prevComment: string;
        }
    );
