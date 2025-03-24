import { Optional } from 'sequelize';
import { Sale } from '@/models/interface/sale.interface';
import { Payment } from '@/models/interface/payment.interface';

// Sale_Payment interface
export interface Sale_Payment {
    id_sale_payment: number;
    id_sale: number;
    id_payment: number;

    sale?: Sale;
    payment?: Payment;
};

// Definir los atributos opcionales para la creación
export interface Sale_PaymentCreationAttributes extends Optional<Sale_Payment, 'id_sale_payment'> { }