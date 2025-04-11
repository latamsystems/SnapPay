package com.example.snappay.src.admin.settings

import kotlinx.serialization.Serializable

@Serializable
data class SyncModel(
    val id_sale: Int,
    val fid: String,
    val identification_client: String
)