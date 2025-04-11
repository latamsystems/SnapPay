export function associateModels(models: typeof import('@/models/init-models').default) {

    // Client
    models.Client.hasMany(models.Sale, { foreignKey: 'id_client', as: 'sale' });

    // Sale
    models.Sale.hasMany(models.Sale_Payment, { foreignKey: 'id_sale', as: 'sale_payment' });

    // Payment
    models.Payment.hasMany(models.Sale_Payment, { foreignKey: 'id_payment', as: 'sale_payment' });
}