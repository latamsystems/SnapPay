package com.example.snappay.src.core.client

import com.example.snappay.src.core.user.UserModel
import com.example.snappay.src.entities.status.StatusModel
import kotlinx.serialization.Serializable

@Serializable
data class ClientModel(
    val id_client: Int,
    val fid: String? = null,
    val fcm_token: String? = null,
    val firstname_client: String,
    val lastname_client: String,
    val identification_client: String,
    val phone_client: String,
    val email_client: String,
    val id_user: Int,
    val id_status: Int,
    val created_at_client: String,
    val inactive_in_client: String? = null,

    val user: UserModel? = null,
    val status: StatusModel? = null
)

@Serializable
data class ClientData(
    val client: List<ClientModel>
)
