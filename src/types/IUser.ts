export interface IUser {
    nombre: String,
    apellido: String,
    email: String,
    celular: String,
    contrasenia: String
}

export interface IUserLogin{
    email: String,
    contrasenia:String
}

export interface IUsuarioLS {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    celular?: string;
    rol?: string;
}
