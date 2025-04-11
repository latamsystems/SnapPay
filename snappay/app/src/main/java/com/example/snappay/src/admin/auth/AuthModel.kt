package com.example.snappay.src.admin.auth

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val email_user: String,
    val password_user: String
)

@Serializable
data class LoginData(
    val token: String
)


@Serializable
data class UserDetails(
    val id_user: Int,
    val firstname_user: String,
    val lastname_user: String,
    val id_role: Int,
)