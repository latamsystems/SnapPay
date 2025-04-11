package com.example.snappay.src.entities.payment

import com.example.snappay.src.entities.status.StatusModel
import kotlinx.serialization.Serializable

@Serializable
data class PaymentModel(
    val id_payment: Int,
    val numDocument_payment: String,
    val value_payment: Double,
    val media_payment: String?,
    val id_status: Int,
    val validated_in_payment: String?,
    val created_at_payment: String,

    val status: StatusModel? = null,
)

@Serializable
data class PaymentData(
    val payment: List<PaymentModel>
)