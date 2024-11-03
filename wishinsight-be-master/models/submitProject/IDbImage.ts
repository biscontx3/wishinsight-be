export interface IDbImage {
  img: string;
  name: string;
}

export class DbImage implements Required<IDbImage> {
  public img: string;
  public name: string;

  constructor(project: IDbImage) {
    this.img = project.img || "";
    this.name = project.name || "";
  }
}
