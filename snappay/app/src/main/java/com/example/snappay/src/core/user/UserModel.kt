package com.example.snappay.src.core.user

import com.example.snappay.src.entities.role.RoleModel
import com.example.snappay.src.entities.status.StatusModel
import kotlinx.serialization.Serializable

@Serializable
data class UserModel(
    val id_user: Int,
    val firstname_user: String,
    val lastname_user: String,
    val identification_user: String,
    val email_user: String,
    val id_role: Int,
    val id_status: Int,
    val resetPasswordToken_user: String? = null,
    val resetPasswordExpires_user: String? = null,
    val created_at_user: String,
    val inactive_in_user: String? = null,

    val role: RoleModel? = null,
    val status: StatusModel? = null,
)

@Serializable
data class UserData(
    val user: List<UserModel>
)