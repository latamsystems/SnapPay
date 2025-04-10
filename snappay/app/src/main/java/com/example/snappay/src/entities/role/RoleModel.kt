package com.example.snappay.src.entities.role

import kotlinx.serialization.Serializable

@Serializable
data class RoleModel(
    val id_role: Int,
    val name_role: String
)

@Serializable
data class RoleData(
    val role: List<RoleModel>
)