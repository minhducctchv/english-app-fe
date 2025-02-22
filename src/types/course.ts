export interface ICourse {
  _id?: any;
  title: string;
  content?: string;
  parentId?: string;
  studiedAt?: Date;
  nextStudyDate?: Date;
  countStudy: number;

  isStudy: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
