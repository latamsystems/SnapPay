
import sequelize, { FindOptions } from "sequelize";
import Console from '@/helpers/console';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { associateModels } from "@/models/associate-models";

import { dbConnection } from '@/src/database';
import { CrudService } from '@/lib/crud/service/crud.service';
import { getIo } from '@/src/monitor';

import { rule, validateRequest } from "@/lib/crud/config/validation/request.validation";
import { handleService } from "@/lib/crud/service/config.service";
import { Service } from "@/lib/crud/service/decorator.service";

import { Sale_Payment } from "@/models/interface/sale_payment.interface";
import { Payment } from "@/models/interface/payment.interface";

// Nombre del servicio
const consoleHelper = new Console("sale_payment Service");

associateModels(models);

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.Sale, as: 'sale' },
        { model: models.Payment, as: 'payment' },
    ]
}

/**
 * Métodos personalizados para el servicio
 */
const serviceMethods = {
    create: (formData: Sale_Payment, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [formData] = args as [any];

            // Reglas de validación
            await validateRequest<Sale_Payment>({
                model: models.Sale_Payment,
                formData,
                rules: [
                    rule.requiredFields(['id_sale', 'numDocument_payment', 'value_payment', 'media_payment']),
                ],
            });

            // Validar que id_sale sea un número entero
            if (typeof formData.id_sale !== 'number' || !Number.isInteger(formData.id_sale)) {
                return HttpResponse.badRequest({ message: reqMsg.validTypeInteger, field: 'id_sale' });
            }

            // Validar que value_payment sea un número (decimal o entero)
            if (typeof formData.value_payment !== 'number' || isNaN(formData.value_payment)) {
                return HttpResponse.badRequest({ message: reqMsg.validTypeNumber, field: 'value_payment' });
            }

            // Validar si existe la venta
            const sale = await models.Sale.findOne({ where: { id_sale: formData.id_sale } });
            if (!sale) return HttpResponse.notFound({ message: reqMsg.notFoundSale });

            // Validar que el número de documento por cliente no este registrado
            const validPayment: any = await models.Sale.findOne({
                where: {
                    id_sale: formData.id_sale
                },
                include: [
                    {
                        model: models.Sale_Payment,
                        as: 'sale_payment',
                        include: [
                            {
                                model: models.Payment,
                                as: 'payment',
                                where: { numDocument_payment: formData.numDocument_payment }
                            }
                        ]
                    }
                ]
            });

            if (validPayment.sale_payment.length > 0) return HttpResponse.badRequest({ message: reqMsg.sameNumDocument, field: 'numDocument_payment' });

            // Iniciar transacción
            let transaction = await dbConnection.transaction();

            // Crear el pago
            const payment = await models.Payment.create({
                numDocument_payment: formData.numDocument_payment,
                value_payment: formData.value_payment,
                media_payment: formData.media_payment,
                id_status: 4,
            }, { transaction });

            // Crear tabla de rompimiento
            const salePayment = await models.Sale_Payment.create({
                id_sale: formData.id_sale,
                id_payment: payment.id_payment,
            }, { transaction });

            // Confirmar transacción
            await transaction.commit();


            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('sale_payment:created', salePayment);

            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [formData]
    }),
    update: (id_sale_payment: number, formData: Sale_Payment, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [id_sale_payment, formData] = args as [number, any];

            // Reglas de validación
            await validateRequest<Sale_Payment>({
                model: models.Sale_Payment,
                formData,
                rules: [
                    rule.requiredFields(['id_sale', 'numDocument_payment', 'value_payment', 'media_payment']),
                    rule.recordExists(id_sale_payment, reqMsg.notFound),
                ],
            });

            // Validar que id_sale sea un número entero
            if (typeof formData.id_sale !== 'number' || !Number.isInteger(formData.id_sale)) {
                return HttpResponse.badRequest({ message: reqMsg.validTypeInteger, field: 'id_sale' });
            }

            // Validar que value_payment sea un número (decimal o entero)
            if (typeof formData.value_payment !== 'number' || isNaN(formData.value_payment)) {
                return HttpResponse.badRequest({ message: reqMsg.validTypeNumber, field: 'value_payment' });
            }

            // Validar si existe la venta
            const sale = await models.Sale.findOne({ where: { id_sale: formData.id_sale } });
            if (!sale) return HttpResponse.notFound({ message: reqMsg.notFoundSale });

            // Validar que el número de documento por cliente no este registrado
            const validPayment: any = await models.Sale.findOne({
                where: {
                    id_sale: formData.id_sale
                },
                include: [
                    {
                        model: models.Sale_Payment,
                        as: 'sale_payment',
                        include: [
                            {
                                model: models.Payment,
                                as: 'payment',
                                where: { numDocument_payment: formData.numDocument_payment }
                            }
                        ]
                    }
                ]
            });

            if (validPayment.sale_payment.length > 0 && validPayment.sale_payment[0].payment.numDocument_payment !== formData.numDocument_payment) return HttpResponse.badRequest({ message: reqMsg.sameNumDocument, field: 'numDocument_payment' });

            // Actualizar el pago
            const payment = await models.Payment.update({
                numDocument_payment: formData.numDocument_payment,
                value_payment: formData.value_payment,
                media_payment: formData.media_payment,
            }, {
                where: { id_payment: validPayment.sale_payment[0].id_payment }
            });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('sale_payment:updated', payment);

            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [id_sale_payment, formData]
    }),
    delete: (id_sale_payment: number, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [id_sale_payment] = args as [number];

            // Reglas de validación
            await validateRequest<Sale_Payment>({
                model: models.Sale_Payment,
                rules: [
                    rule.recordExists(id_sale_payment, reqMsg.notFound),
                ],
            });

            // Obtener el pago
            const sale_payment = await models.Sale_Payment.findOne({
                where: { id_sale_payment },
                include: [
                    {
                        model: models.Payment,
                        as: 'payment'
                    }
                ]
            })

            // Transaccion
            let transaction = await dbConnection.transaction();

            // Eliminar el pago
            const delete_sale_payment = await models.Sale_Payment.destroy({
                where: { id_sale_payment }, transaction
            });

            // Eliminar el pago
            await models.Payment.destroy({
                where: { id_payment: sale_payment?.payment?.id_payment }, transaction
            });

            // Confirmar transacción
            await transaction.commit();

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('sale_payment:deleted', delete_sale_payment);


            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [id_sale_payment]
    })
};

export default { crud: CrudService(models.Sale_Payment, consoleHelper, config, serviceMethods) };

// =============================================================================
// =============================================================================

export class Sale_PaymentService {}
