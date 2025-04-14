import { Optional } from 'sequelize';
import { Status } from '@/models/interface/status.interface';

// Payment interface
export interface Payment {
    id_payment: number;
    numDocument_payment: string;
    value_payment: number;
    media_payment: string;
    numQuota_payment: number;
    id_status: number;
    validated_in_payment?: Date | null;
    created_at_payment?: Date;

    status?: Status;
};

// Definir los atributos opcionales para la creación
export interface PaymentCreationAttributes extends Optional<Payment, 'id_payment' | 'validated_in_payment'> { }