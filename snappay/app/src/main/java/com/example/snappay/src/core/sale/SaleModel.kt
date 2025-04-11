package com.example.snappay.src.core.sale

import com.example.snappay.src.core.client.ClientModel
import com.example.snappay.src.core.device.DeviceModel
import com.example.snappay.src.core.user.UserModel
import com.example.snappay.src.entities.status.StatusModel
import kotlinx.serialization.Serializable

@Serializable
data class SaleModel(
    val id_sale: Int,
    val fid: String? = null,
    val fcm_token: String? = null,
    val imei_sale: String,
    val fees_sale: Int,
    val isFine_sale: Boolean,
    val id_client: Int,
    val id_device: Int,
    val id_user: Int,
    val id_status: Int,
    val activation_at_sale: String,
    val finish_at_sale: String? = null,
    val created_at_sale: String,

    val client: ClientModel? = null,
    val device: DeviceModel? = null,
    val user: UserModel? = null,
    val status: StatusModel? = null
)

@Serializable
data class SaleDataWarper(
    val sale: SaleModel
)

@Serializable
data class SaleData(
    val sale: List<SaleModel>
)