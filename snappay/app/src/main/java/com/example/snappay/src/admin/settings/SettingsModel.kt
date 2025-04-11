package com.example.snappay.src.admin.settings

import kotlinx.serialization.Serializable

@Serializable
data class ClientSyncModel(
    val id_client: Int,
    val fid: String,
    val identification_client: String
)