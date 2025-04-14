package com.example.snappay.src.entities.typeFees

import kotlinx.serialization.Serializable

@Serializable
data class TypeFeesModel(
    val id_typeFees: Int,
    val name_typeFees: String
)

@Serializable
data class StatusData(
    val typeFees: List<TypeFeesModel>
)