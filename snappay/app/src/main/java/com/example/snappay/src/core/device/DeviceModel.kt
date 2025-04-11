package com.example.snappay.src.core.device

import com.example.snappay.src.core.user.UserModel
import com.example.snappay.src.entities.status.StatusModel
import kotlinx.serialization.Serializable


@Serializable
data class DeviceModel(
    val id_device: Int,
    val price_device: Int,
    val id_model: Int,
    val id_user: Int,
    val id_status: Int,

//    val model: ModelModel? = null,
    val user: UserModel? = null,
    val status: StatusModel? = null
)