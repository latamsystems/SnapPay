import { Optional } from 'sequelize';
import { Status } from './status.interface';

// Control interface
export interface Control {
    id_control?: number;
    name_control: string;
    id_status: number;
    creationDate_control?: Date;
    deactivationDate_control?: Date | null;

    status?: Status;
};

// Definir los atributos opcionales para la creación
export interface ControlCreationAttributes extends Optional<Control, 'id_control' | 'deactivationDate_control'> { }