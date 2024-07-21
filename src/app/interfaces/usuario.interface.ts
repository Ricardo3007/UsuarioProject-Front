export interface IUsuario{
id?:number;
name:string;
lastName:string;
documentType:string;
documentNumber:string;
email:string;
fullName?:string;
document?:string;
dataUser?:IDataUser;
}
export interface IDataUser{
  id?:number;
  username:string;
  password:string;
}