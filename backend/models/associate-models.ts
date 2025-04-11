export function associateModels(models: typeof import('@/models/init-models').default) {

    // Sale
    models.Sale.hasMany(models.Sale_Payment, { foreignKey: 'id_sale', as: 'sale_payment' });

    // Payment
    models.Payment.hasMany(models.Sale_Payment, { foreignKey: 'id_payment', as: 'sale_payment' });
}