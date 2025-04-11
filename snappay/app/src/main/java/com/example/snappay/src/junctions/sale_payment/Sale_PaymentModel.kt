package com.example.snappay.src.junctions.sale_payment

import com.example.snappay.src.core.sale.SaleModel
import com.example.snappay.src.entities.payment.PaymentModel
import kotlinx.serialization.Serializable

@Serializable
data class Sale_PaymentModel(
    val id_sale_payment: Int,
    val id_sale: Int,
    val id_payment: Int,

    val sale: SaleModel? = null,
    val payment: PaymentModel? = null,
)

@Serializable
data class Sale_PaymentData(
    val sale_payment: List<Sale_PaymentModel>
)