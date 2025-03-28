package com.example.snappay.src.entities.status

import kotlinx.serialization.Serializable

@Serializable
data class StatusModel(
    val id_status: Int,
    val name_status: String
)
